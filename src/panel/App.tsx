import * as React from "react";
import {
  Box,
  Checkbox,
  Stack,
  useToast,
  HStack,
  Divider,
  Heading,
  Tag,
  TagLabel,
  TagCloseButton,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import "./App.css";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";
import { ItemCopyModal } from "./ItemCopyModal";
import { ListCopyModal } from "./ListCopyModal";
import { FormatType, RequestInfo } from "./types";
import { getFormatter } from "./utils";

let gid = 0;

const getId = () => {
  return gid++;
};

const App = () => {
  const [requests, setRequests] = React.useState<RequestInfo[]>([]);
  const [currentId, setCurrentId] = React.useState<number | null>(null);
  const [formatType, setFormatType] = React.useState<FormatType>("json");
  const [whitelistMimeTypes, setWhitelistMimeTypes] = React.useState<string[]>([
    "json",
  ]);
  const [mimeType, setMimeType] = React.useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentRequest = React.useMemo(
    () => requests.find((request) => request.id === currentId),
    [currentId]
  );

  const filteredRequests = React.useMemo(() => {
    return requests.filter((request) => {
      if (whitelistMimeTypes.length === 0) {
        return true;
      }

      return whitelistMimeTypes.some((mimeType) =>
        request.contentMimeType.includes(mimeType)
      );
    });
  }, [requests, whitelistMimeTypes]);

  const checkedRequests = filteredRequests.filter((request) => request.checked);
  const format = getFormatter(formatType);

  React.useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener((request) => {
      const id = getId();
      const response = request.response;

      const method = request.request.method;
      const url = request.request.url;
      const status = response.status;
      const contentSize = response.content.size;
      const contentMimeType = response.content.mimeType;
      const headers = response.headers;

      const contentType: string =
        headers.find((header) => header.name.toLowerCase() === "content-type")
          ?.value || "";

      request.getContent((body) => {
        const getBody = () => {
          try {
            return JSON.parse(body);
          } catch (err) {
            return body;
          }
        };
        setRequests((prev) => {
          return [
            ...prev,
            {
              checked: true,
              id,
              method: method.toUpperCase(),
              url,
              status,
              contentSize,
              contentMimeType,
              contentType,
              body: getBody(),
              headers,
            },
          ];
        });
      });
    });
  }, []);

  const handleClick = (id: number) => {
    setCurrentId(id);
  };

  return (
    <div className="App">
      <div>
        <Box>
          <Button
            leftIcon={<FaTrash />}
            colorScheme="red"
            size="sm"
            onClick={() => {
              setRequests([]);
              setCurrentId(null);
            }}
          >
            기록된 요청 삭제
          </Button>
        </Box>
        <Divider />
        <Box>
          <Heading size="md">필터 설정</Heading>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mimeType) {
                setWhitelistMimeTypes((prev) => {
                  return [...prev, mimeType];
                });
                setMimeType("");
              }
            }}
          >
            <HStack>
              <Input
                placeholder="Whitelist MIME type 추가"
                size="sm"
                value={mimeType}
                onChange={(e) => {
                  setMimeType(e.target.value);
                }}
              />
              <Button
                colorScheme="teal"
                size="sm"
                onClick={() => {
                  if (mimeType) {
                    setWhitelistMimeTypes((prev) => {
                      return [...prev, mimeType];
                    });
                    setMimeType("");
                  }
                }}
              >
                Add
              </Button>
            </HStack>
          </form>
          {whitelistMimeTypes.map((mimeType) => (
            <Tag
              size={"md"}
              key={"md"}
              borderRadius="full"
              variant="solid"
              colorScheme="green"
            >
              <TagLabel>{mimeType}</TagLabel>
              <TagCloseButton
                onClick={() => {
                  setWhitelistMimeTypes((prev) => {
                    return prev.filter(
                      (whitelistMimeType) => whitelistMimeType !== mimeType
                    );
                  });
                }}
              />
            </Tag>
          ))}
        </Box>

        <Divider />
        <Box>
          <Heading size="md">결과 타입</Heading>
          <RadioGroup
            onChange={(v: FormatType) => setFormatType(v)}
            value={formatType}
          >
            <Stack direction="row">
              <Radio value="msw">msw handlers</Radio>
              <Radio value="json">JSON</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Divider />
        <Box>
          <Button
            leftIcon={<BsLightningFill />}
            colorScheme="teal"
            size="sm"
            onClick={() => {
              onOpen();
            }}
          >
            선택한 요청 전체를 배열로 만들기
          </Button>
          ({filteredRequests.filter((request) => request.checked).length}/
          {filteredRequests.length})
        </Box>
      </div>
      <div className="App_contents">
        <Table variant="striped" colorScheme="gray" size="sm" width="full">
          <Thead>
            <Tr>
              <Th>선택</Th>
              <Th>Method</Th>
              <Th>URL</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRequests.map((request) => (
              <Tr>
                <Td>
                  <Checkbox
                    isChecked={request.checked}
                    onChange={() => {
                      setRequests((prev) => {
                        return prev.map((r) => {
                          if (r.id === request.id) {
                            return { ...r, checked: !r.checked };
                          } else {
                            return r;
                          }
                        });
                      });
                    }}
                  />
                </Td>
                <Td>{request.method}</Td>
                <Td onClick={() => handleClick(request.id)}>{request.url}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <ItemCopyModal
        isOpen={!!currentRequest}
        onClose={() => {
          setCurrentId(null);
        }}
        request={currentRequest}
        format={format}
      />
      <ListCopyModal
        isOpen={isOpen}
        onClose={onClose}
        requests={checkedRequests}
        format={format}
      />
    </div>
  );
};

export default App;
