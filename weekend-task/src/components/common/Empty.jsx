import { Empty, Button } from "antd";

function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display.",
  buttonText,
  onClick,
}) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Empty
          description={
            <>
              <h3
                style={{
                  color: "#FFFFFF",
                  marginBottom: 10,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  color: "#828FA3",
                }}
              >
                {description}
              </p>
            </>
          }
        />

        {buttonText && (
          <Button
            type="primary"
            size="large"
            style={{
              marginTop: 20,
              borderRadius: 25,
              height: 45,
              paddingInline: 30,
            }}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;