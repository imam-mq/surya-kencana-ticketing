import React from "react";
import { Button } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const SubmitButton = ({ isLoading, children, onClick, ...props }) => {
  return (
    <Button
      isLoading={isLoading}
      spinner={<BeatLoader size={8} color="white" />}
      type="submit"
      width="full"
      bg="#314D9C"
      color="white"
      _hover={{ bg: "#263A75" }}
      _active={{ bg: "#1F2F5E" }}
      py={6}
      onClick={onClick}
      {...props}
    >
      {/* ✅ PERBAIKAN: Cukup panggil children saja. 
          Chakra UI otomatis mengurus teksnya saat loading. */}
      {children}
    </Button>
  );
};

export default SubmitButton;