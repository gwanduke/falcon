import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import * as copy from "copy-to-clipboard";
import { RequestInfo } from "./types";
import { useCopyToast } from "./hooks";
var beautify = require("js-beautify").js;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request?: RequestInfo;
  format: (requestInfo: RequestInfo) => string;
}

export const ItemCopyModal = ({ isOpen, onClose, request, format }: Props) => {
  const toast = useCopyToast();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader isTruncated>
          {request?.method} 🙌 {request?.url}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            onClick={() => {
              if (request) {
                copy(
                  beautify(format(request), {
                    indent_size: 2,
                    space_in_empty_paren: true,
                  })
                );
                toast();
              }
            }}
          >
            복사
          </Button>

          {request && (
            <Textarea
              height={"full"}
              className="textarea"
              value={beautify(format(request), {
                indent_size: 2,
                space_in_empty_paren: true,
              })}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
