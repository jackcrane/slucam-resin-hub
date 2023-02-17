import { Button, Divider, Image, Input, Space, Table, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { Between, Container } from "./styleds";
import moment from "moment";
import ResinModal from "./ResinModal";
import CreateResinModal from "./CreateResinModal";
import CreateTrialModal from "./CreateTrialModal";

const Resins = (props) => {
  const [resins, setResins] = useState([]);
  const [unfilteredResins, setUnfilteredResins] = useState([]);
  const [selectedResin, setSelectedResin] = useState({});
  const [resinModalVisible, setResinModalVisible] = useState(false);
  const [createResinModalVisible, setCreateResinModalVisible] = useState(false);
  const [createTrialModalVisible, setCreateTrialModalVisible] = useState(false);

  const [bump, setBump] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    setResins(
      unfilteredResins.filter((resin) => {
        if (search === "") return true;
        return JSON.stringify(resin)
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [unfilteredResins, search]);

  useEffect(() => {
    console.log("Visible state changed to: ", resinModalVisible);
  }, [resinModalVisible]);

  useEffect(() => {
    fetch("/resins")
      .then((res) => res.json())
      .then((resins) => setUnfilteredResins(resins));
  }, [bump]);
  return (
    <>
      <Container>
        <Between>
          <Typography.Title>Resins</Typography.Title>
          <Image
            height={60}
            preview={false}
            src="https://www.slu.edu/marcom/tools-downloads/imgs/logo/left-aligned/slu_logoleftaligned_rgb.png"
          />
        </Between>

        <Space>
          <Button
            type="primary"
            onClick={() => setCreateResinModalVisible(true)}
          >
            Add resin
          </Button>
          <Button
            type="primary"
            onClick={() => setCreateTrialModalVisible(true)}
          >
            Record a trial
          </Button>
        </Space>
        <Divider />
        <Space direction="vertical">
          <Between>
            <Typography.Text></Typography.Text>
            <Input.Search
              placeholder="Search resins"
              style={{ maxWidth: "30%" }}
              onInput={(e) => setSearch(e.target.value)}
            />
          </Between>
          <Table
            dataSource={resins}
            columns={[
              { title: "Name", dataIndex: "name", key: "name" },
              {
                title: "Manufacturer",
                dataIndex: "manufacturer",
                key: "manufacturer",
              },
              { title: "Color", dataIndex: "color", key: "color" },
              { title: "Trials", dataIndex: "trials", key: "trials" },
              {
                title: "Updated",
                dataIndex: "updatedAt",
                key: "updatedAt",
                render: (text) =>
                  `${moment(text).format("MM/DD/YYYY hh:mm a")} (${moment(
                    text
                  ).fromNow()})`,
              },
              {
                title: "Open",
                dataIndex: "open",
                key: "open",
                render: (text, record) => (
                  <Button
                    onClick={() => {
                      console.log("Clicked");
                      setSelectedResin(record);
                      setResinModalVisible(true);
                    }}
                  >
                    More details
                  </Button>
                ),
              },
            ]}
          />
        </Space>
      </Container>
      <ResinModal
        resin={selectedResin}
        visible={resinModalVisible}
        onClose={() => setResinModalVisible(false)}
      />
      <CreateResinModal
        visible={createResinModalVisible}
        onClose={() => setCreateResinModalVisible(false)}
        onResinCreated={() => {
          setBump(bump + 1);
        }}
        key={`create-resin-modal-${bump}`}
      />
      <CreateTrialModal
        visible={createTrialModalVisible}
        onClose={() => setCreateTrialModalVisible(false)}
        onTrialCreated={() => {
          setBump(bump + 1);
        }}
        key={`create-trial-modal-${bump}`}
      />
    </>
  );
};

export default Resins;
