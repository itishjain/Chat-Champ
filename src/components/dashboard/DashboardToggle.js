import React from "react";
import { Button, Drawer, Icon } from "rsuite";
import Dashboard from ".";
import { useMediaQuery, useModalState } from "../../misc/custom-hooks";

const DashboardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const is992px = useMediaQuery("(max-width: 992px)");
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" />
        Dashboard
      </Button>
      <Drawer full={is992px} show={isOpen} onHide={close} placement="left">
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
