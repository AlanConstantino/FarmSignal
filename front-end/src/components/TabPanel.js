// Tab switching functionality
function TabPanel(props) {
  const {children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

export default TabPanel;
