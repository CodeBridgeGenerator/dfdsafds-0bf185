import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import CustomerPage from "../CustomerPage/CustomerPage";
import InvoicePage from "../InvoicePage/InvoicePage";
import ItemsPage from "../ItemsPage/ItemsPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "customer":
                return <CustomerPage />;
case "invoice":
                return <InvoicePage />;
case "items":
                return <ItemsPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;