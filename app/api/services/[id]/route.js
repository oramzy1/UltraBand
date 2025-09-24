import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export async function PATCH(req, { params }) {
  const body = await req.json();
  const supabase = await createClient();

  // If title changes, regenerate slug
  const updates = body.title ? { ...body, slug: slugify(body.title) } : body;

  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_, { params }) {
  const supabase = await createClient();

  const { error } = await supabase.from("services").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
