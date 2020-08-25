import React from "react";
import {
  FilterFieldSet,
  FilterResult,
  Cms,
  ScoreValue,
  BasicField,
  ScoreField,
  CmsData,
  CategoryCmsProperty,
  CategoryField,
  PropertyType,
  BooleanCmsProperty,
} from "./Cms";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  FiCheckCircle,
  FiBox,
  FiPackage,
  FiAward,
  FiPower,
  FiSlash,
} from "react-icons/fi";
import { GrLicense } from "react-icons/gr";
import { MdUpdate } from "react-icons/md";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import deepcopy from "ts-deepcopy";
import CmsService from "./CmsService";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  TitleTemplate,
  BooleanPropertyTemplate,
  CmsTableData,
  sortData,
} from "./TableTemplates";

export default function CmsDetailView(props: {
  filterFields: FilterFieldSet;
  filterResults: FilterResult[];
  cmsData: CmsData;
}) {
  const { cmsKey } = useParams();
  let filterResult: FilterResult;
  let cms: Cms;

  if (cmsKey && props.cmsData[cmsKey]) {
    cms = props.cmsData[cmsKey];
    const filterResultIndex = props.filterResults.findIndex(
      (filterResult) => filterResult.cmsKey === cmsKey
    );
    filterResult = props.filterResults[filterResultIndex];
  } else {
    return (
      <Alert variant="warning">
        Invalid CMS key was given! Go back to the{" "}
        <Link to="/card">
          <Button>Card View</Button>
        </Link>{" "}
        and select a CMS!
      </Alert>
    );
  }

  const tableValues: CmsTableData = [];
  const basicFilterFields = props.filterFields.basic;
  Object.keys(basicFilterFields).forEach((key: string) => {
    const prop = cms.properties[key];
    if (prop) {
      if (prop.type === PropertyType.Boolean) {
        tableValues.push({
          name: {
            name: prop.name,
            description: basicFilterFields[key].description,
          },
          value: {
            name: prop.name,
            value: prop.value,
            info: prop.info,
          },
        });
      } else {
        const basicFilterSubFields: CategoryField = basicFilterFields[key];
        const catprop: CategoryCmsProperty = prop;
        const subFieldKeys = CmsService.getKeysOfSubFields(
          basicFilterFields[key]
        );
        subFieldKeys.forEach((subkey: string) => {
          const subprop: BooleanCmsProperty = catprop[subkey];
          if (subprop) {
            const name = `${prop.name}: ${subprop.name}`;
            tableValues.push({
              name: {
                name,
                description: basicFilterSubFields[subkey].description,
              },
              value: {
                name,
                value: subprop.value,
                info: subprop.info,
              },
            });
          }
        });
      }
    }
  });

  return (
    <section id="detail-view" className="pb-5">
      <Container>
        <Row>
          <Col>
            <div className="text-left mb-5">
              <Link to="/card">
                {" "}
                <i className="pi pi-arrow-left"></i> Back to the overview
              </Link>
            </div>
            <Card className="p-2 d-flex flex-row justify-content-between">
              <span className="specialProperty">
                <GrLicense /> {cms.license}
              </span>
              <span className="specialProperty">
                <FiBox /> {cms.category.toString()}
              </span>
              <span className="specialProperty">
                <FiPackage /> Version {cms.version}
              </span>
              <span className="specialProperty">
                <FiPower /> {cms.inception}
              </span>
            </Card>

            <PropertyList name={cms.name} filterResult={filterResult} />

            <h3 className="my-5" key="all">
              All Features or {cms.name}
            </h3>
            <Card>
              <DataTable value={tableValues}>
                <Column
                  header="Feature"
                  field="name"
                  sortable
                  sortFunction={(e) => sortData(tableValues, e)}
                  body={TitleTemplate}
                />
                <Column
                  header="Supported?"
                  field="value"
                  sortable
                  sortFunction={(e) => sortData(tableValues, e)}
                  body={BooleanPropertyTemplate}
                />
              </DataTable>
            </Card>
            <span className="lastUpdated">
              <MdUpdate className="mr-1" /> This information was last updated on{" "}
              {new Date(cms.lastUpdated).toDateString()}
            </span>
            <span></span>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function PropertyList(props: { filterResult: FilterResult; name: string }) {
  const hasProperties = categorizePropertiesByScores(
    props.filterResult.has.basic
  );

  const hasNotProperties = categorizePropertiesByScores(
    props.filterResult.hasNot.basic
  );

  let categorizedProperties: {
    required: {
      has: { [x: string]: ScoreField };
      hasNot: { [x: string]: ScoreField };
    };
    niceToHave: {
      has: { [x: string]: ScoreField };
      hasNot: { [x: string]: ScoreField };
    };
  } = {
    required: {
      has: hasProperties.required,
      hasNot: hasNotProperties.required,
    },
    niceToHave: {
      has: hasProperties.niceToHave,
      hasNot: hasNotProperties.niceToHave,
    },
  };

  const requiredListItems = constructResultListItems(
    categorizedProperties.required
  );

  if (requiredListItems.length > 0) {
    requiredListItems.unshift(
      <h3 key="required">Your required features of {props.name}</h3>
    );
    requiredListItems.push(
      <RequiredSummaryListItem key="requiredSummary" {...props} />
    );
  }

  const niceToHaveListItems = constructResultListItems(
    categorizedProperties.niceToHave
  );

  if (niceToHaveListItems.length > 0) {
    niceToHaveListItems.unshift(
      <h3 key="nice-to-have">Your nice-to-have features of {props.name}</h3>
    );
    niceToHaveListItems.push(
      <NiceToHaveSummaryListItem key="niceToHaveSummary" {...props} />
    );
  }

  return (
    <div>
      <Card className="info-box my-5">
        <div className="p-3">{requiredListItems}</div>
      </Card>
      <Card className="info-box my-5">
        <div className="p-3">{niceToHaveListItems}</div>
      </Card>
    </div>
  );
}

function categorizePropertiesByScores(indexedPropertyArray: {
  [x: string]: BasicField;
}): {
  required: { [x: string]: ScoreField };
  niceToHave: { [x: string]: ScoreField };
} {
  let requiredProperties: { [x: string]: ScoreField } = {};
  let niceToHaveProperties: { [x: string]: ScoreField } = {};

  const indexedPropertyArrayCopy = deepcopy<{
    [x: string]: BasicField;
  }>(indexedPropertyArray);
  const propertyKeys = Object.keys(indexedPropertyArrayCopy);

  for (const propertyKey of propertyKeys) {
    const currentProperty = indexedPropertyArrayCopy[propertyKey];
    if (isScoreFilterProperty(currentProperty)) {
      currentProperty.value === ScoreValue.REQUIRED
        ? (requiredProperties[propertyKey] = currentProperty)
        : (niceToHaveProperties[propertyKey] = currentProperty);
    } else {
      const hasSubKeys = CmsService.getKeysOfSubFields(currentProperty);

      for (const subKey of hasSubKeys) {
        const currentSubProperty = currentProperty[subKey];
        currentSubProperty.name =
          currentProperty.name + ": " + currentSubProperty.name;
        currentSubProperty.value === ScoreValue.REQUIRED
          ? (requiredProperties[subKey] = currentSubProperty)
          : (niceToHaveProperties[subKey] = currentSubProperty);
      }
    }
  }
  return {
    required: requiredProperties,
    niceToHave: niceToHaveProperties,
  };
}

function isScoreFilterProperty(x: BasicField): x is ScoreField {
  if (!x) return false;
  return x.value !== undefined;
}

function constructResultListItems(fieldSet: {
  has: { [x: string]: ScoreField };
  hasNot: { [x: string]: ScoreField };
}) {
  let listItems: JSX.Element[] = [];

  const hasKeys = Object.keys(fieldSet.has);
  for (const hasKey of hasKeys) {
    const currentProperty = fieldSet.has[hasKey];
    listItems.push(
      <ResultListItem key={hasKey} cmsHasProperty property={currentProperty} />
    );
  }

  const hasNotKeys = Object.keys(fieldSet.hasNot);
  for (const hasNotKey of hasNotKeys) {
    const currentProperty = fieldSet.hasNot[hasNotKey];
    listItems.push(
      <ResultListItem key={hasNotKey} property={currentProperty} />
    );
  }

  return listItems;
}

function ResultListItem(props: {
  property: ScoreField;
  cmsHasProperty?: boolean;
}) {
  const icon = props.cmsHasProperty ? <FiCheckCircle /> : <FiSlash />;
  return (
    <div
      className="resultListItem"
      // variant={props.cmsHasProperty ? undefined : "light"}
    >
      <span>{props.property.name}</span>
      {icon}
    </div>
  );
}

function RequiredSummaryListItem(props: { filterResult: FilterResult }) {
  return (
    <div
    // variant={props.filterResult.satisfactory ? "success" : "warning"}
    >
      <h2 style={{ fontSize: "1.3em" }}>
        {props.filterResult.satisfactory ? <FiCheckCircle /> : <FiSlash />}{" "}
        {`CMS ${
          props.filterResult.satisfactory ? `satisfies` : `does not satisfy`
        } all your essential requirements.`}
      </h2>
    </div>
  );
}

function NiceToHaveSummaryListItem(props: { filterResult: FilterResult }) {
  return (
    <div
    // variant="info"
    >
      <div className="d-inline-flex w-100 align-items-center">
        {props.filterResult.hasNiceToHaveShare > 0 ? (
          <FiAward style={{ marginRight: "0.5em", fontSize: "1.5em" }} />
        ) : (
          <FiSlash style={{ marginRight: "0.5em", fontSize: "1.5em" }} />
        )}{" "}
        <ProgressBar
          style={{ width: "100%" }}
          animated
          now={props.filterResult.hasNiceToHaveShare * 100}
          variant="info"
          label={`${(props.filterResult.hasNiceToHaveShare * 100).toFixed(0)}%`}
        />
      </div>
    </div>
  );
}
