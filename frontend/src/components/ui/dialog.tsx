export {
  Root as Dialog,
  Trigger as DialogTrigger,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Title as DialogTitle,
  Description as DialogDescription,
} from "@radix-ui/react-dialog";

export function DialogHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-1">{children}</div>;
}