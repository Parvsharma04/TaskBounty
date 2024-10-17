import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export default function AnimatedModalTasks({
  isOpen,
  onOpenChange,
  title,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode; // Change content to children
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        header: "bg-black",
        body: "bg-black",
        footer: "bg-black",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {children}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
