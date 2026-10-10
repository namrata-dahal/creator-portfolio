import {redirect} from "next/navigation";
import {INQUIRY_BACKEND} from "@/lib/inquiry-proxy";
export const metadata={title:"Private Inbox | Namrata Dahal",robots:{index:false,follow:false}};
export default function Inbox(){redirect(`${INQUIRY_BACKEND}/inbox`);}
