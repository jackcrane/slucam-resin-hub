import { Button, Divider, Image, Input, Space, Table, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { Between, Container } from "./styleds";
import moment from "moment";
import ResinModal from "./ResinModal";
import CreateResinModal from "./CreateResinModal";
import CreateTrialModal from "./CreateTrialModal";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Resins = (props) => {
  const [resins, setResins] = useState([]);
  const [unfilteredResins, setUnfilteredResins] = useState([]);
  const [selectedResin, setSelectedResin] = useState({});
  const [resinModalVisible, setResinModalVisible] = useState(false);
  const [createResinModalVisible, setCreateResinModalVisible] = useState(false);
  const [createTrialModalVisible, setCreateTrialModalVisible] = useState(false);
  const [bump, setBump] = useState(0);
  const [search, setSearch] = useState("");
  const [columnSort, setColumnSort] = useState({});

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
    fetch("/resins")
      .then((res) => res.json())
      .then((resins) => setUnfilteredResins(resins));
  }, [bump]);

  const handleTableChange = (pagination, filters, sorter) => {
    setColumnSort(sorter);
  };

  const sortedResins = [...resins];

  if (columnSort.columnKey) {
    const { columnKey, order } = columnSort;
    sortedResins.sort((a, b) => {
      if (order === "descend") {
        return b[columnKey].localeCompare(a[columnKey]);
      } else {
        return a[columnKey].localeCompare(b[columnKey]);
      }
    });
  }

  const { height, width } = useWindowDimensions();

  return (
    <>
      <Container>
        <Between>
          <Typography.Title>Resins</Typography.Title>
          {width > 768 && (
            <Image
              height={60}
              preview={false}
              src="https://www.slu.edu/marcom/tools-downloads/imgs/logo/left-aligned/slu_logoleftaligned_rgb.png"
            />
          )}
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
            Record a print
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
            dataSource={sortedResins}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                key: "name",
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ["descend", "ascend"],
              },
              {
                title: "Manufacturer",
                dataIndex: "manufacturer",
                key: "manufacturer",
                sorter: (a, b) => a.manufacturer.localeCompare(b.manufacturer),
                sortDirections: ["descend", "ascend"],
              },
              { title: "Color", dataIndex: "color", key: "color" },
              {
                title: "Trials",
                dataIndex: "trials",
                key: "trials",
                sorter: (a, b) => a.trials - b.trials,
                sortDirections: ["descend", "ascend"],
              },
              {
                title: "In progress",
                dataIndex: "inProgress",
                key: "inProgress",
                sorter: (a, b) => a.inProgress - b.inProgress,
                sortDirections: ["descend", "ascend"],
              },
              {
                title: "Created",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (text) => moment(text).format("MM/DD/YYYY hh:mm a"),
                sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
                sortDirections: ["descend", "ascend"],
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
