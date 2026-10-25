import { useRef, useState } from "react";
import { Link } from "react-router";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PageHeading,
  Notice,
  StatePanel,
  StatusBadge,
} from "@/components/shared";

export function DesignSystemPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogOpener = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <PageHeading
        title="One visual language."
        description="Shared components and explicit state examples for design review. These examples do not create product records."
      />
      <section className="component-section">
        <h2>Screen previews</h2>
        <nav className="action-row" aria-label="Screen previews">
          {[
            ["Landing", routes.home],
            ["Sign in", routes.login],
            ["Registration", routes.register],
            ["Email verification", routes.verify],
            ["Password recovery", routes.recovery],
            ["Dashboard", routes.dashboard],
            ["Entry choice", routes.welcome],
            ["Discovery", routes.discovery],
            ["Results", routes.results],
            ["Career catalog", routes.careers],
            ["Roadmap and topics", routes.roadmap("frontend")],
            ["Profile", routes.profile],
            ["Account and security", routes.account],
          ].map(([label, to]) => (
            <Button key={to} variant="outline" asChild>
              <Link to={to}>{label}</Link>
            </Button>
          ))}
        </nav>
      </section>
      <section className="component-section">
        <h2>Color and hierarchy</h2>
        <div className="swatch-list">
          <div
            className="swatch"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Primary · #000000
          </div>
          <div className="swatch" style={{ background: "white" }}>
            Canvas · #ffffff
          </div>
          <div className="swatch" style={{ background: "var(--secondary)" }}>
            Surface · #f4f4f5
          </div>
          <div
            className="swatch"
            style={{ background: "var(--ring)", color: "white" }}
          >
            Focus · #007a53
          </div>
        </div>
      </section>
      <section className="component-section">
        <h2>Actions and controls</h2>
        <div className="action-row">
          <Button
            onClick={(event) => {
              dialogOpener.current = event.currentTarget;
              setDialogOpen(true);
            }}
          >
            Open example dialog
          </Button>
          <Button
            variant="outline"
            onClick={(event) => {
              dialogOpener.current = event.currentTarget;
              setDialogOpen(true);
            }}
          >
            Secondary action
          </Button>
          <Button disabled>Unavailable action</Button>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              dialogOpener.current?.focus();
            }}
          >
            <DialogHeader>
              <DialogTitle>Keep the next step clear.</DialogTitle>
              <DialogDescription>
                This example tests dialog focus, Escape and returning focus to
                the trigger. It does not save a change.
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button onClick={() => setDialogOpen(false)}>
                Close example
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <div className="component-grid mt-6">
          <Card className="settings-card">
            <div className="field">
              <Label htmlFor="example-name">A clear field label</Label>
              <Input id="example-name" placeholder="Example input" />
              <p className="field-help">
                Supporting information belongs beside the field.
              </p>
            </div>
          </Card>
          <Card className="settings-card">
            <div className="field">
              <Label htmlFor="example-error">A field with an error</Label>
              <Input
                id="example-error"
                aria-invalid="true"
                aria-describedby="example-error-message"
              />
              <p className="field-error" id="example-error-message">
                Example: enter your first name.
              </p>
            </div>
          </Card>
        </div>
      </section>
      <section className="component-section">
        <h2>Feedback and topic states</h2>
        <div className="action-row mb-6">
          <StatusBadge status="Not started" />
          <StatusBadge status="Learning" />
          <StatusBadge status="Done" />
          <StatusBadge status="Skipped" />
        </div>
        <Tabs defaultValue="empty">
          <TabsList aria-label="Feedback examples">
            <TabsTrigger value="empty">Empty</TabsTrigger>
            <TabsTrigger value="loading">Loading</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
          </TabsList>
          <TabsContent value="empty">
            <StatePanel kind="empty" title="No roadmap selected">
              In the app, this state offers a route to the career catalog.
            </StatePanel>
          </TabsContent>
          <TabsContent value="loading">
            <StatePanel kind="loading" title="Loading roadmap">
              Static loading example. No request is running.
            </StatePanel>
          </TabsContent>
          <TabsContent value="error">
            <StatePanel kind="error" title="The roadmap could not load">
              Example failure copy explains what failed and offers a next
              action.
            </StatePanel>
          </TabsContent>
          <TabsContent value="success">
            <Notice tone="success">
              Success-message styling example only. Nothing has been saved.
            </Notice>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
