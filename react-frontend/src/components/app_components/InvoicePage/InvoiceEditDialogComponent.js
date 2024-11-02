import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const InvoiceCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [customer, setCustomer] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount customer
                    client
                        .service("customer")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCustomerId } })
                        .then((res) => {
                            setCustomer(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Customer", type: "error", message: error.message || "Failed get customer" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            name: _entity?.name,
customer: _entity?.customer?._id,
subtotal: _entity?.subtotal,
totalamount: _entity?.totalamount,
discount: _entity?.discount,
delivery: _entity?.delivery,
        };

        setLoading(true);
        try {
            
        await client.service("invoice").patch(_entity._id, _data);
        const eagerResult = await client
            .service("invoice")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "customer",
                    service : "customer",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info invoice updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const customerOptions = customer.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Invoice" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="invoice-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="name">Name:</label>
                <InputText id="name" className="w-full mb-3 p-inputtext-sm" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["name"]) && (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="customer">Customer:</label>
                <Dropdown id="customer" value={_entity?.customer?._id} optionLabel="name" optionValue="value" options={customerOptions} onChange={(e) => setValByKey("customer", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["customer"]) && (
              <p className="m-0" key="error-customer">
                {error["customer"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="subtotal">Subtotal:</label>
                <InputText id="subtotal" className="w-full mb-3 p-inputtext-sm" value={_entity?.subtotal} onChange={(e) => setValByKey("subtotal", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["subtotal"]) && (
              <p className="m-0" key="error-subtotal">
                {error["subtotal"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="totalamount">Total amount:</label>
                <InputText id="totalamount" className="w-full mb-3 p-inputtext-sm" value={_entity?.totalamount} onChange={(e) => setValByKey("totalamount", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["totalamount"]) && (
              <p className="m-0" key="error-totalamount">
                {error["totalamount"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="discount">Discount:</label>
                <InputText id="discount" className="w-full mb-3 p-inputtext-sm" value={_entity?.discount} onChange={(e) => setValByKey("discount", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["discount"]) && (
              <p className="m-0" key="error-discount">
                {error["discount"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="delivery">Delivery:</label>
                <InputText id="delivery" className="w-full mb-3 p-inputtext-sm" value={_entity?.delivery} onChange={(e) => setValByKey("delivery", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["delivery"]) && (
              <p className="m-0" key="error-delivery">
                {error["delivery"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(InvoiceCreateDialogComponent);
