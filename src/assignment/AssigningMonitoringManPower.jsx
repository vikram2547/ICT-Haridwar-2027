
import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { Form, Select, Input, Button, Divider, message } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const AssigningMonitoringManPower = () => {
  const [dict, lang] = useOutletContext();

  const t = (key, fallback) =>
    dict?.[key]?.[lang] ?? dict?.[key]?.en ?? fallback ?? key;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    try {
      const localAssignments =
        JSON.parse(localStorage.getItem("assignments")) || [];

      localAssignments.push(JSON.parse(JSON.stringify(values)));

      localStorage.setItem(
        "assignments",
        JSON.stringify(localAssignments)
      );

      message.success(
        t(
          "manpower_assignment_success",
          "Assignment saved successfully"
        )
      );

      form.resetFields();
    } catch (error) {
      message.error(
        t(
          "manpower_assignment_error",
          "Unable to save assignment. Please try again."
        )
      );
    }
  };

  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  const assets = [
    { id: 1, name: "Asset 1" },
    { id: 2, name: "Asset 2" },
    { id: 3, name: "Asset 3" },
  ];

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg mt-3 w-full">
      <div className="text-d9 text-2xl flex items-end justify-between">
        <div className="font-bold">
          {t("manpower_assignment_form", "Assignment Form")}
        </div>

        <div className="text-xs">
          {t(
            "mandatory_fields_note",
            "All * marked fields are mandatory"
          )}
        </div>
      </div>

      <Divider className="bg-d9 h-2/3 mt-1" />

      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          {t("loading", "Loading...")}
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: "admin",
            department: "sanitation",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
            {/* User Name */}
            <Form.Item
              label={
                <div className="font-semibold">
                  {t("manpower_user_name", "User Name")}
                </div>
              }
              name="userName"
              rules={[
                {
                  required: true,
                  message: t(
                    "manpower_select_user_required",
                    "Please select a user"
                  ),
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder={t("manpower_select_user", "Select User")}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="rounded-none"
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.name}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Role */}
            <Form.Item
              label={
                <div className="font-semibold">
                  {t("manpower_role", "Role")}
                </div>
              }
              name="role"
              rules={[
                {
                  required: true,
                  message: t(
                    "manpower_select_role_required",
                    "Please select a role"
                  ),
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder={t("manpower_select_role", "Select Role")}
                className="rounded-none"
              >
                <Option value="admin">
                  {t("manpower_admin", "Admin")}
                </Option>
                <Option value="monitoringAgent">
                  {t("manpower_monitoring_agent", "Monitoring Agent")}
                </Option>
                <Option value="driver">
                  {t("manpower_driver", "Driver")}
                </Option>
                <Option value="supervisor">
                  {t("manpower_supervisor", "Supervisor")}
                </Option>
                <Option value="vendor">
                  {t("manpower_vendor", "Vendor")}
                </Option>
                <Option value="misOfficer">
                  {t("manpower_mis_officer", "MIS Officer")}
                </Option>
              </Select>
            </Form.Item>

            {/* Department */}
            <Form.Item
              label={
                <div className="font-semibold">
                  {t("manpower_department", "Department")}
                </div>
              }
              name="department"
              rules={[
                {
                  required: true,
                  message: t(
                    "manpower_select_department_required",
                    "Please select a department"
                  ),
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder={t(
                  "manpower_select_department",
                  "Select Department"
                )}
                className="rounded-none"
              >
                <Option value="sanitation">
                  {t("manpower_sanitation", "Sanitation")}
                </Option>
                <Option value="tentage">
                  {t("manpower_tentage", "Tentage")}
                </Option>
                <Option value="mis">
                  {t("manpower_mis", "MIS")}
                </Option>
                <Option value="admin">
                  {t("manpower_admin", "Admin")}
                </Option>
              </Select>
            </Form.Item>

            {/* Sub Department */}
            <Form.Item
              label={
                <div className="font-semibold">
                  {t("manpower_sub_department", "Sub Department")}
                </div>
              }
              name="subDepartment"
              rules={[
                {
                  required: true,
                  message: t(
                    "manpower_select_sub_department_required",
                    "Please select a sub department"
                  ),
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder={t(
                  "manpower_select_sub_department",
                  "Select Sub Department"
                )}
                className="rounded-none"
              >
                <Option value="manpowerDeployment">
                  {t(
                    "manpower_deployment",
                    "Manpower Deployment"
                  )}
                </Option>
                <Option value="equipmentManagement">
                  {t(
                    "manpower_equipment_management",
                    "Equipment Management"
                  )}
                </Option>
              </Select>
            </Form.Item>

            {/* Asset Name */}
            <Form.Item
              label={
                <div className="font-semibold">
                  {t("manpower_asset_name", "Asset Name")}
                </div>
              }
              name="assetName"
              rules={[
                {
                  required: true,
                  message: t(
                    "manpower_select_asset_required",
                    "Please select an asset name"
                  ),
                },
              ]}
              className="mb-4"
            >
              <Select
                placeholder={t(
                  "manpower_select_asset",
                  "Select Asset Name"
                )}
                className="rounded-none"
              >
                {assets.map((asset) => (
                  <Option key={asset.id} value={asset.name}>
                    {asset.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Assignment Details */}
            <Form.Item
              label={
                <div className="font-semibold">
                  {t(
                    "manpower_assignment_details",
                    "Assignment Details"
                  )}
                </div>
              }
              name="assignmentDetails"
              className="mb-4"
            >
              <TextArea
                rows={3}
                placeholder={t(
                  "manpower_enter_assignment_details",
                  "Enter Assignment Details"
                )}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-fit rounded-none bg-5c"
              >
                {t("submit", "Submit")}
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
    </div>
  );
};

export default AssigningMonitoringManPower;
