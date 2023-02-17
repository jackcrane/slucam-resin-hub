import { Divider, Drawer, Image, List, Tabs, Typography } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import ModalTimeline from "./ResinModalTimeline";
import ModalTrials from "./ResinModalTrials";
import { Between } from "./styleds";

const ResinModal = (props) => {
  const [resin, setResin] = useState({});
  useEffect(() => {
    if (!props.visible) return;
    fetch(`/resins/${props.resin.id}`)
      .then((res) => res.json())
      .then((resin) => setResin(resin));
  }, [props]);
  if (!resin.id) return <div></div>;
  return (
    <Drawer
      title={
        <Between>
          <span>
            {resin.manufacturer} {resin.name}
          </span>
          <Image src={`/resins/${resin.id}/qr`} width={50} />
        </Between>
      }
      placement="right"
      closable={true}
      onClose={props.onClose}
      open={props.visible}
    >
      <List
        bordered
        dataSource={[
          {
            title: "Manufacturer",
            text: resin.manufacturer,
          },
          {
            title: "Name",
            text: resin.name,
          },
          {
            title: "Color",
            text: resin.color,
          },
          {
            title: "Updated",
            text: `${moment(resin.updatedAt).format(
              "MM/DD/YYYY hh:mm a"
            )} (${moment(resin.updatedAt).fromNow()})`,
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text>
              {item.title} | {item.text}
            </Typography.Text>
          </List.Item>
        )}
      />
      <Divider />
      <Typography.Title level={4}>Trials</Typography.Title>
      <ModalTrials resin={resin} />
      {/* <Tabs
        centered
        defaultActiveKey="trials"
        items={[
          {
            label: "Trials",
            key: "trials",
            children: <ModalTrials resin={resin} />,
          },
          {
            label: "Timeline",
            key: "timeline",
            children: <ModalTimeline resin={resin} />,
          },
        ]}
      /> */}
    </Drawer>
  );
};

export default ResinModal;
