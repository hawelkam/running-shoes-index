"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import { Button, Col, Flex, Image, Modal, Row } from "antd";
import { useState } from "react";

interface ModalProps {
  shoe: SanityRunningShoe;
}

const CompareModal = ({ shoe }: ModalProps) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setIsOpened(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
        </svg>
        Compare with previous version
      </Button>
      <Modal
        title="Compare"
        open={isOpened}
        onOk={() => setIsOpened(false)}
        width="80%"
      >
        <Flex style={{ width: "100%" }} vertical>
          <Row justify="center">
            <Col span={8}></Col>
            <Col span={8}>
              <h3 className="tracking-widest">{shoe.previousVersion.name}</h3>
            </Col>
            <Col span={8}>
              <h3 className="tracking-widest">{shoe.name}</h3>
            </Col>
          </Row>
          <Row>
            <Col span={8}></Col>
            <Col span={8}>
              <Image
                width={300}
                src={shoe.previousVersion.image.url}
                alt="tailwind logo"
                className="rounded-xl"
              />
            </Col>
            <Col span={8}>
              <Image
                width={300}
                src={shoe.image.url}
                alt="tailwind logo"
                className="rounded-xl"
              />
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Category</Col>
            <Col span={8}>
              {shoe.previousVersion.category?.map((cat) => cat.name).join(", ")}
            </Col>
            <Col span={8}>
              {shoe.category?.map((cat) => cat.name).join(", ")}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Price</Col>
            <Col span={8}>
              {shoe.previousVersion.releaseInfo.eu?.price && (
                <div>{`🇪🇺 €${shoe.previousVersion.releaseInfo.eu?.price}`}</div>
              )}
              {shoe.previousVersion.releaseInfo.us?.price && (
                <div>{`🇺🇸 $${shoe.previousVersion.releaseInfo.us?.price}`}</div>
              )}
              {shoe.previousVersion.releaseInfo.pl?.price && (
                <div>{`🇵🇱 ${shoe.previousVersion.releaseInfo.pl?.price}zł`}</div>
              )}
            </Col>
            <Col span={8}>
              {shoe.releaseInfo.eu?.price && (
                <div>{`🇪🇺 €${shoe.releaseInfo.eu?.price}`}</div>
              )}
              {shoe.releaseInfo.us?.price && (
                <div>{`🇺🇸 $${shoe.releaseInfo.us?.price}`}</div>
              )}
              {shoe.releaseInfo.pl?.price && (
                <div>{`🇵🇱 ${shoe.releaseInfo.pl?.price}zł`}</div>
              )}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Release date</Col>
            <Col span={8}>
              {shoe.previousVersion.releaseInfo.eu?.date && (
                <div>{`🇪🇺 ${Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  year: "numeric",
                }).format(
                  new Date(shoe.previousVersion.releaseInfo.eu.date)
                )}`}</div>
              )}
              {shoe.previousVersion.releaseInfo.us?.date && (
                <div>{`🇺🇸 ${Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  year: "numeric",
                }).format(
                  new Date(shoe.previousVersion.releaseInfo.us.date)
                )}`}</div>
              )}
              {shoe.previousVersion.releaseInfo.pl?.date && (
                <div>{`🇵🇱 ${Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  year: "numeric",
                }).format(
                  new Date(shoe.previousVersion.releaseInfo.pl.date)
                )}`}</div>
              )}
            </Col>
            <Col span={8}>
              {shoe.releaseInfo.eu?.date && (
                <div>{`🇪🇺 ${Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  year: "numeric",
                }).format(new Date(shoe.releaseInfo.eu.date))}`}</div>
              )}
              {shoe.releaseInfo.us?.date && (
                <div>{`🇺🇸 ${Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  year: "numeric",
                }).format(new Date(shoe.releaseInfo.us.date))}`}</div>
              )}
              {shoe.releaseInfo.pl?.date && (
                <div>{`🇵🇱 ${Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  year: "numeric",
                }).format(new Date(shoe.releaseInfo.pl.date))}`}</div>
              )}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Weight</Col>
            <Col span={8}>
              {shoe.previousVersion.specs.m?.weight &&
                `M: ${shoe.previousVersion.specs.m?.weight}g`}
              {shoe.previousVersion.specs.w?.weight &&
                ` | W: ${shoe.previousVersion.specs.w?.weight}g`}
            </Col>
            <Col span={8}>
              {shoe.specs.m?.weight && `M: ${shoe.specs.m?.weight}g`}
              {shoe.specs.w?.weight && ` | W: ${shoe.specs.w?.weight}g`}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Drop</Col>
            <Col span={8}>
              {shoe.previousVersion.specs.m?.drop && `${shoe.specs.m?.drop}mm`}
            </Col>
            <Col span={8}>
              {shoe.specs.m?.drop && `${shoe.specs.m?.drop}mm`}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Heel stack</Col>
            <Col span={8}>
              {shoe.previousVersion.specs.m?.heelStack &&
                `M: ${shoe.previousVersion.specs.m?.heelStack}mm`}
              {shoe.previousVersion.specs.w?.heelStack &&
                ` | W: ${shoe.previousVersion.specs.w?.heelStack}mm`}
            </Col>
            <Col span={8}>
              {shoe.specs.m?.heelStack && `M: ${shoe.specs.m?.heelStack}mm`}
              {shoe.specs.w?.heelStack && ` | W: ${shoe.specs.w?.heelStack}mm`}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Stability</Col>
            <Col span={8}>{shoe.previousVersion.stability}</Col>
            <Col span={8}>{shoe.stability}</Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Upper</Col>
            <Col span={8}>
              {shoe.previousVersion.specs.upper
                ?.map((cat) => cat.name)
                .join(", ")}
            </Col>
            <Col span={8}>
              {shoe.specs.upper?.map((cat) => cat.name).join(", ")}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Foam</Col>
            <Col span={8}>
              {shoe.previousVersion.specs.foam
                ?.map((cat) => cat.name)
                .join(", ")}
            </Col>
            <Col span={8}>
              {shoe.specs.foam?.map((cat) => cat.name).join(", ")}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Plate</Col>
            <Col span={8}>{shoe.previousVersion.specs.plate}</Col>
            <Col span={8}>{shoe.specs.plate}</Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Outsole</Col>
            <Col span={8}>
              {shoe.previousVersion.specs.outsole
                ?.map((cat) => cat.name)
                .join(", ")}
            </Col>
            <Col span={8}>
              {shoe.specs.outsole?.map((cat) => cat.name).join(", ")}
            </Col>
          </Row>
          <Row justify="center">
            <Col span={8}>Notes</Col>
            <Col span={8}>{shoe.previousVersion.notes}</Col>
            <Col span={8}>{shoe.notes}</Col>
          </Row>
        </Flex>
      </Modal>
    </>
  );
};

export default CompareModal;
