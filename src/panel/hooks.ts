import { useToast } from "@chakra-ui/react";

export const useCopyToast = () => {
  const toast = useToast();

  return () =>
    toast({
      position: "bottom-left",
      title: "복사하기 성공",
      description: "필요한 코드에 붙여넣어 사용하세요.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
};
