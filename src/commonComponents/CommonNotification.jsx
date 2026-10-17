import { notification } from "antd";
import React, { useEffect } from "react";

const CommonNotification = ({ label, desc, type = "success" }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: label,
      description: desc,
    });
  };
  
  useEffect(() => {
    if (label && desc) {
      openNotificationWithIcon(type);
    }
  });

  return <div>{contextHolder}</div>;
};

export default CommonNotification;
