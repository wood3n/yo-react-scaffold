import React from "react";
import Button from "@/components/Button";

export default () => {
  const handleClick = () => {
    alert("this is a button");
  };

  return <Button onClick={handleClick}>测试</Button>;
};
