"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Button,
  message,
  Tabs,
  Divider,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Brand {
  _id: string;
  name: string;
}

interface ShoeReference {
  _id: string;
  name: string;
  brand?: { name: string };
}

interface CreateShoeFormValues {
  name: string;
  brandId: string;
  purpose: string;
  stability: string;
  categories?: string[];
  wideAvailable: boolean;
  // Release Info
  plReleaseDate?: Date;
  plPrice?: number;
  euReleaseDate?: Date;
  euPrice?: number;
  usReleaseDate?: Date;
  usPrice?: number;
  // Specs
  mWeight?: number;
  mDrop?: number;
  mHeelStack?: number;
  wWeight?: number;
  wDrop?: number;
  wHeelStack?: number;
  upper?: string;
  foam?: string;
  plate?: string;
  outsole?: string;
  notes?: string;
  // Version references
  previousVersion?: string;
  nextVersion?: string;
}

interface CreateShoeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PURPOSE_OPTIONS = [
  { value: "Road", label: "Road" },
  { value: "Trail", label: "Trail" },
  { value: "Gravel", label: "Gravel" },
  { value: "Gym / Treadmill", label: "Gym / Treadmill" },
  { value: "Track", label: "Track" },
];

const STABILITY_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "stable", label: "Stable" },
];

const CATEGORY_OPTIONS = [
  { value: "Waterproof", label: "Waterproof" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Lightweight", label: "Lightweight" },
  { value: "Supertrainer", label: "Supertrainer" },
  { value: "Long run", label: "Long run" },
  { value: "Race day", label: "Race day" },
  { value: "Tempo", label: "Tempo" },
  { value: "Stability trainer", label: "Stability trainer" },
  { value: "Daily trainer", label: "Daily trainer" },
  { value: "5k/10k", label: "5k/10k" },
  { value: "21k/42k", label: "21k/42k" },
  { value: "Ultra", label: "Ultra" },
];

export default function CreateShoeDialog({
  open,
  onClose,
  onSuccess,
}: CreateShoeDialogProps) {
  const [form] = Form.useForm<CreateShoeFormValues>();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [shoes, setShoes] = useState<ShoeReference[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchFormData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [brandsResponse, shoesResponse] = await Promise.all([
        fetch("/api/admin/brands"),
        fetch("/api/shoes?minimal=true"),
      ]);

      if (brandsResponse.ok) {
        const brandsData = (await brandsResponse.json()) as { brands: Brand[] };
        setBrands(brandsData.brands ?? []);
      }

      if (shoesResponse.ok) {
        const shoesData = (await shoesResponse.json()) as ShoeReference[];
        setShoes(shoesData ?? []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load form data");
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Fetch brands and shoes when dialog opens
  useEffect(() => {
    if (open) {
      void fetchFormData();
    }
  }, [open, fetchFormData]);

  const handleSubmit = async (values: CreateShoeFormValues) => {
    setLoading(true);
    try {
      // Build the request payload
      const payload = {
        name: values.name,
        brandId: values.brandId,
        purpose: values.purpose,
        stability: values.stability,
        categories: values.categories,
        wideAvailable: values.wideAvailable ?? false,
        releaseInfo: {
          ...(values.plReleaseDate && {
            pl: {
              date: values.plReleaseDate.toISOString().split("T")[0],
              price: values.plPrice ?? 0,
            },
          }),
          ...(values.euReleaseDate && {
            eu: {
              date: values.euReleaseDate.toISOString().split("T")[0],
              price: values.euPrice ?? 0,
            },
          }),
          ...(values.usReleaseDate && {
            us: {
              date: values.usReleaseDate.toISOString().split("T")[0],
              price: values.usPrice ?? 0,
            },
          }),
        },
        specs: {
          ...((values.mWeight ?? values.mDrop ?? values.mHeelStack)
            ? {
                m: {
                  weight: values.mWeight,
                  drop: values.mDrop,
                  heelStack: values.mHeelStack,
                },
              }
            : {}),
          ...((values.wWeight ?? values.wDrop ?? values.wHeelStack)
            ? {
                w: {
                  weight: values.wWeight,
                  drop: values.wDrop,
                  heelStack: values.wHeelStack,
                },
              }
            : {}),
          upper: values.upper,
          foam: values.foam,
          plate: values.plate,
          outsole: values.outsole,
        },
        notes: values.notes,
        previousVersion: values.previousVersion,
        nextVersion: values.nextVersion,
      };

      const response = await fetch("/api/admin/create-shoe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create shoe");
      }

      message.success(`Shoe "${values.name}" created successfully!`);
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating shoe:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to create shoe"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const tabItems = [
    {
      key: "basic",
      label: "Basic Info",
      children: (
        <div className="space-y-4">
          <Form.Item
            name="name"
            label="Shoe Name"
            rules={[
              { required: true, message: "Please enter the shoe name" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 100, message: "Name must be at most 100 characters" },
            ]}
          >
            <Input placeholder="e.g., Nike Pegasus 41" />
          </Form.Item>

          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please select a brand" }]}
          >
            <Select
              placeholder="Select brand"
              loading={loadingData}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {brands.map((brand) => (
                <Select.Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[{ required: true, message: "Please select a purpose" }]}
          >
            <Select placeholder="Select purpose" options={PURPOSE_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="stability"
            label="Stability"
            rules={[
              { required: true, message: "Please select stability type" },
            ]}
          >
            <Select
              placeholder="Select stability"
              options={STABILITY_OPTIONS}
            />
          </Form.Item>

          <Form.Item name="categories" label="Categories">
            <Select
              mode="multiple"
              placeholder="Select categories"
              options={CATEGORY_OPTIONS}
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            name="wideAvailable"
            label="Wide Available"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      ),
    },
    {
      key: "release",
      label: "Release Info",
      children: (
        <div className="space-y-6">
          <div>
            <Divider orientation="left">Poland (PL)</Divider>
            <div className="flex gap-4">
              <Form.Item
                name="plReleaseDate"
                label="Release Date"
                className="flex-1"
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="plPrice" label="Price (PLN)" className="flex-1">
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="e.g., 599"
                />
              </Form.Item>
            </div>
          </div>

          <div>
            <Divider orientation="left">Europe (EU)</Divider>
            <div className="flex gap-4">
              <Form.Item
                name="euReleaseDate"
                label="Release Date"
                className="flex-1"
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="euPrice" label="Price (EUR)" className="flex-1">
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="e.g., 149"
                />
              </Form.Item>
            </div>
          </div>

          <div>
            <Divider orientation="left">United States (US)</Divider>
            <div className="flex gap-4">
              <Form.Item
                name="usReleaseDate"
                label="Release Date"
                className="flex-1"
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="usPrice" label="Price (USD)" className="flex-1">
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="e.g., 149"
                />
              </Form.Item>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "specs",
      label: "Specifications",
      children: (
        <div className="space-y-6">
          <div>
            <Divider orientation="left">Men&apos;s Specs (US 9)</Divider>
            <div className="flex gap-4">
              <Form.Item name="mWeight" label="Weight (g)" className="flex-1">
                <InputNumber
                  min={0}
                  max={500}
                  className="w-full"
                  placeholder="e.g., 285"
                />
              </Form.Item>
              <Form.Item name="mDrop" label="Drop (mm)" className="flex-1">
                <InputNumber
                  min={0}
                  max={20}
                  className="w-full"
                  placeholder="e.g., 10"
                />
              </Form.Item>
              <Form.Item
                name="mHeelStack"
                label="Heel Stack (mm)"
                className="flex-1"
              >
                <InputNumber
                  min={0}
                  max={60}
                  className="w-full"
                  placeholder="e.g., 38"
                />
              </Form.Item>
            </div>
          </div>

          <div>
            <Divider orientation="left">Women&apos;s Specs (US 7)</Divider>
            <div className="flex gap-4">
              <Form.Item name="wWeight" label="Weight (g)" className="flex-1">
                <InputNumber
                  min={0}
                  max={500}
                  className="w-full"
                  placeholder="e.g., 245"
                />
              </Form.Item>
              <Form.Item name="wDrop" label="Drop (mm)" className="flex-1">
                <InputNumber
                  min={0}
                  max={20}
                  className="w-full"
                  placeholder="e.g., 10"
                />
              </Form.Item>
              <Form.Item
                name="wHeelStack"
                label="Heel Stack (mm)"
                className="flex-1"
              >
                <InputNumber
                  min={0}
                  max={60}
                  className="w-full"
                  placeholder="e.g., 38"
                />
              </Form.Item>
            </div>
          </div>

          <Divider orientation="left">Materials</Divider>
          <div className="flex gap-4">
            <Form.Item name="upper" label="Upper" className="flex-1">
              <Input placeholder="e.g., Engineered mesh" />
            </Form.Item>
            <Form.Item name="foam" label="Foam" className="flex-1">
              <Input placeholder="e.g., ZoomX" />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="plate" label="Plate" className="flex-1">
              <Input placeholder="e.g., Carbon fiber" />
            </Form.Item>
            <Form.Item name="outsole" label="Outsole" className="flex-1">
              <Input placeholder="e.g., Continental rubber" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: "versions",
      label: "Versions",
      children: (
        <div className="space-y-4">
          <Form.Item name="previousVersion" label="Previous Version">
            <Select
              placeholder="Select previous version"
              loading={loadingData}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {shoes.map((shoe) => (
                <Select.Option key={shoe._id} value={shoe._id}>
                  {shoe.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="nextVersion" label="Next Version">
            <Select
              placeholder="Select next version"
              loading={loadingData}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {shoes.map((shoe) => (
                <Select.Option key={shoe._id} value={shoe._id}>
                  {shoe.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      children: (
        <Form.Item name="notes" label="Additional Notes">
          <Input.TextArea
            rows={6}
            placeholder="Add any additional notes about this shoe..."
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Modal
      title="Create New Shoe"
      open={open}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
          onClick={() => form.submit()}
        >
          Create Shoe
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => void handleSubmit(values)}
        initialValues={{
          wideAvailable: false,
        }}
      >
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
}
