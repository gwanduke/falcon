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
import { useCopyToast } from "./hooks";
var beautify = require("js-beautify").js;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requests: RequestInfo[];
  format: (requestInfo: RequestInfo) => string;
}

export const ListCopyModal = ({ isOpen, onClose, requests, format }) => {
  const toast = useCopyToast();

  const code = beautify(`[${requests.map(format).join(", ")}]`, {
    indent_size: 2,
    space_in_empty_paren: true,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>선택한 요청 전체를 배열로 만들기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            onClick={() => {
              copy(code);
              toast();
            }}
          >
            복사
          </Button>
          <Textarea width="full" height="500px" fontSize="sm" value={code} />
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
