"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RepeatingListEditor } from "@/components/admin/repeating-list-editor";
import { useSiteConfig } from "@/context/site-config-context";
import { saveSiteConfig } from "@/lib/site-config";
import { defaultSiteConfig, type SiteConfig } from "@/lib/default-content";

type ContentFormValues = Omit<SiteConfig, "theme">;

function stripTheme(config: SiteConfig): ContentFormValues {
  const { theme: _theme, ...rest } = config;
  return rest;
}

export default function ContentManagerPage() {
  const { config, isLive } = useSiteConfig();
  const seeded = React.useRef(false);
  const [saving, setSaving] = React.useState(false);

  const { register, control, handleSubmit, reset } = useForm<ContentFormValues>({
    defaultValues: stripTheme(defaultSiteConfig),
  });

  React.useEffect(() => {
    if (isLive && !seeded.current) {
      reset(stripTheme(config));
      seeded.current = true;
    }
  }, [isLive, config, reset]);

  const onSubmit = async (values: ContentFormValues) => {
    setSaving(true);
    try {
      await saveSiteConfig(values);
      toast.success("Content saved — live on the site now.");
    } catch {
      toast.error("Couldn't save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Content</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the words on the public site. Changes go live the moment you save.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save changes
        </Button>
      </div>

      <Tabs defaultValue="site" className="mt-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="site">Site & nav</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="how">How it works</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Site name</Label>
                  <Input className="mt-1.5" {...register("siteName")} />
                </div>
                <div>
                  <Label>Logo text</Label>
                  <Input className="mt-1.5" {...register("logoText")} />
                </div>
              </div>
              <div>
                <Label>Tagline</Label>
                <Input className="mt-1.5" {...register("tagline")} />
              </div>

              <div>
                <p className="text-sm font-medium">Navigation links</p>
                <div className="mt-3">
                  <RepeatingListEditor
                    control={control}
                    register={register}
                    name="nav"
                    itemLabel="link"
                    minItems={1}
                    newItem={{ label: "New link", href: "/" }}
                    fields={[
                      { name: "label", label: "Label" },
                      { name: "href", label: "URL" },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <Label>Eyebrow</Label>
                <Input className="mt-1.5" {...register("hero.eyebrow")} />
              </div>
              <div>
                <Label>Headline</Label>
                <Textarea className="mt-1.5" {...register("hero.headline")} />
              </div>
              <div>
                <Label>Subhead</Label>
                <Textarea className="mt-1.5" {...register("hero.subhead")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Primary button label</Label>
                  <Input className="mt-1.5" {...register("hero.ctaPrimary")} />
                </div>
                <div>
                  <Label>Secondary button label</Label>
                  <Input className="mt-1.5" {...register("hero.ctaSecondary")} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Stats</p>
                <div className="mt-3">
                  <RepeatingListEditor
                    control={control}
                    register={register}
                    name="hero.stats"
                    itemLabel="stat"
                    newItem={{ value: "0", label: "New stat" }}
                    fields={[
                      { name: "value", label: "Value" },
                      { name: "label", label: "Label" },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="how" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <Label>Section heading</Label>
                <Input className="mt-1.5" {...register("howItWorks.heading")} />
              </div>
              <div>
                <p className="text-sm font-medium">Steps</p>
                <div className="mt-3">
                  <RepeatingListEditor
                    control={control}
                    register={register}
                    name="howItWorks.steps"
                    itemLabel="step"
                    minItems={1}
                    newItem={{ title: "New step", description: "Describe this step." }}
                    fields={[
                      { name: "title", label: "Title" },
                      { name: "description", label: "Description", type: "textarea" },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Section heading</Label>
                  <Input className="mt-1.5" {...register("features.heading")} />
                </div>
                <div>
                  <Label>Subheading</Label>
                  <Input className="mt-1.5" {...register("features.subheading")} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Feature items</p>
                <div className="mt-3">
                  <RepeatingListEditor
                    control={control}
                    register={register}
                    name="features.items"
                    itemLabel="feature"
                    minItems={1}
                    newItem={{ title: "New feature", description: "Describe this feature." }}
                    fields={[
                      { name: "title", label: "Title" },
                      { name: "description", label: "Description", type: "textarea" },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <Label>Section heading</Label>
                <Input className="mt-1.5" {...register("testimonials.heading")} />
              </div>
              <div>
                <p className="text-sm font-medium">Quotes</p>
                <div className="mt-3">
                  <RepeatingListEditor
                    control={control}
                    register={register}
                    name="testimonials.items"
                    itemLabel="quote"
                    minItems={1}
                    newItem={{ quote: "New quote.", name: "Name", role: "City" }}
                    fields={[
                      { name: "quote", label: "Quote", type: "textarea" },
                      { name: "name", label: "Name" },
                      { name: "role", label: "Role / city" },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <Label>Heading</Label>
                <Input className="mt-1.5" {...register("cta.heading")} />
              </div>
              <div>
                <Label>Subheading</Label>
                <Input className="mt-1.5" {...register("cta.subheading")} />
              </div>
              <div>
                <Label>Button label</Label>
                <Input className="mt-1.5" {...register("cta.buttonLabel")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="mt-5">
          <Card>
            <CardContent className="space-y-5 p-5">
              <div>
                <Label>About text</Label>
                <Textarea className="mt-1.5" {...register("footer.about")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1.5" {...register("footer.email")} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1.5" {...register("footer.phone")} />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input className="mt-1.5" {...register("footer.address")} />
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-sm font-medium">Invoice & legal details</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  These also print on every customer invoice generated from a booking.
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Legal / registered business name</Label>
                    <Input className="mt-1.5" {...register("footer.legalName")} />
                  </div>
                  <div>
                    <Label>Tax ID / GSTIN (optional)</Label>
                    <Input className="mt-1.5" {...register("footer.taxId")} />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Invoice terms & notes</Label>
                  <Textarea className="mt-1.5" rows={3} {...register("footer.invoiceTerms")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
