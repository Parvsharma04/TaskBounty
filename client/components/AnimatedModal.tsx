import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function AnimatedModal({
  isOpen,
  onOpenChange,
  title,
  content,
}: any) {
  return (
    <>
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
                <ul className="list-disc ml-4">
                  {content.map((val: string, idx: number) => {
                    return <li key={idx}>{val}</li>;
                  })}
                </ul>
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
    </>
  );
}
