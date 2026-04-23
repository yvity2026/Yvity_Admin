import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkImage() {
  const { data, error } = await supabase
    .from("advisor_gallery")
    .select("image_url")
    .limit(1);

  if (error) {
    console.error("DB Error:", error);
    return;
  }

  if (data && data.length > 0) {
    const url = data[0].image_url;
    console.log("Checking URL:", url);
    const res = await fetch(url);
    console.log("Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Response text:", text.substring(0, 200));
  } else {
    console.log("No images found.");
  }
}

checkImage();
