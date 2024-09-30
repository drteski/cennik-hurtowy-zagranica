import { Html, Section, Text, Row, Column } from "jsx-email";
import { format } from "date-fns";

const EmailTemplate = ({ data, locale, name, currency }) => {
  return (
    <Html>
      <Text>
        Price Changes for {name} {format(new Date(), "dd-MM-yyyy")}
      </Text>
      <Section>
        <Row style={{ borderBottom: "1px solid black" }}>
          <Column
            style={{
              padding: "3px 6px",
              color: "black",
              textAlign: "left",
              width: 50,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            ID
          </Column>
          <Column
            style={{
              padding: "3px 6px",
              color: "black",
              textAlign: "left",
              width: 75,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            SKU
          </Column>
          <Column
            style={{
              padding: "3px 6px",
              color: "black",
              textAlign: "left",
              width: 75,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            EAN
          </Column>
          <Column
            style={{
              padding: "3px 6px",
              color: "black",
              textAlign: "left",
              // width: "40%",
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            TITLE
          </Column>
          <Column
            style={{
              padding: "3px 6px",
              color: "black",
              textAlign: "right",
              width: 80,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            OLD PRICE
          </Column>
          <Column
            style={{
              padding: "3px 6px",
              color: "black",
              textAlign: "right",
              width: 80,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            NEW PRICE
          </Column>
        </Row>
        {data.map((item) => {
          if (typeof item === "undefined") return;
          return (
            <Row style={{ borderBottom: "1px solid black" }} key={item.ean}>
              <Column
                style={{
                  padding: "3px 6px",
                  color: "black",
                  textAlign: "left",
                  width: 50,
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                {item.id}
              </Column>
              <Column
                style={{
                  padding: "3px 6px",
                  color: "black",
                  textAlign: "left",
                  width: 75,
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                {item.sku}
              </Column>
              <Column
                style={{
                  padding: "3px 6px",
                  color: "black",
                  textAlign: "left",
                  width: 75,
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                {item.ean === "" ? "0000000000000" : item.ean}
              </Column>
              <Column
                style={{
                  padding: "3px 6px",
                  color: "black",
                  textAlign: "left",
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                {item.title}
              </Column>
              <Column
                style={{
                  padding: "3px 6px",
                  color: "black",
                  textAlign: "right",
                  width: 80,
                  fontSize: 12,
                }}
              >
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: currency,
                }).format(parseFloat(item.oldPrice))}
              </Column>
              <Column
                style={{
                  padding: "3px 6px",
                  color:
                    item.difference === 0
                      ? "black"
                      : item.difference < 0
                        ? "#da1e28"
                        : "#24a148",
                  textAlign: "right",
                  fontWeight: 700,
                  width: 80,
                  fontSize: 12,
                }}
              >
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: currency,
                }).format(parseFloat(item.newPrice))}
              </Column>
            </Row>
          );
        })}
      </Section>
    </Html>
  );
};

export default EmailTemplate;
