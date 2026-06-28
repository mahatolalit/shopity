import { useState } from "react";
import {
  Card,
  Page,
  Layout,
  TextField,
  Button,
  FormLayout,
  Text,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

export default function HomePage() {
  const [announcementText, setAnnouncementText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const shopify = useAppBridge();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ announcementText }),
      });

      if (response.ok) {
        shopify.toast.show("Announcement saved successfully");
        setAnnouncementText("");
      } else {
        shopify.toast.show("Failed to save announcement", { isError: true });
      }
    } catch (error) {
      console.error(error);
      shopify.toast.show("Error saving announcement", { isError: true });
    }
    setIsSaving(false);
  };

  return (
    <Page narrowWidth>
      <TitleBar title="App Dashboard" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <Text as="h2" variant="headingMd">
                Set Store Announcement
              </Text>
              <TextField
                label="Announcement Text"
                value={announcementText}
                onChange={setAnnouncementText}
                autoComplete="off"
                multiline={3}
              />
              <Button primary onClick={handleSave} loading={isSaving}>
                Save Announcement
              </Button>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}