import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { logs } from "@opentelemetry/api-logs";
import { resourceFromAttributes } from "@opentelemetry/resources";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfiguration(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
  );
}

if (process.env.NODE_ENV === "development" && !projectToken)
  throw missingConfiguration("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN");
if (process.env.NODE_ENV === "development" && !host)
  throw missingConfiguration("NEXT_PUBLIC_POSTHOG_HOST");

export const posthogLogProvider =
  projectToken && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          "service.name": "namrata-portfolio",
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL("/i/v1/logs", host).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : undefined;

export const posthogInquiryLogger = posthogLogProvider?.getLogger(
  "posthog.portfolio.inquiry",
);

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && posthogLogProvider) {
    logs.setGlobalLoggerProvider(posthogLogProvider);
  }
}

export async function flushPostHogLogs() {
  await posthogLogProvider?.forceFlush();
}
