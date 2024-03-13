
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import Container from "screens/container";
import { useTheme } from '@mui/material/styles';
import ProductJsonConfig from "config/product_config.json";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import * as Api from "shared/services";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { GetMetaDataInfo } from "shared/common";

const screenItems = ['product', 'producttype', 'otherdetails', 'productprice'];

const Component = (props) => {

    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data, prodImages, productId;

        let product = row['product'];

        // Add Or Update Product
        rslt = await Support.AddOrUpdateProduct(product, dropDownOptions, ['MainImage', 'OtherImages']);
        if (rslt.status) {
            productId = rslt.id;
        } else { return; }

        // Add Product Type
        rslt = await Support.AddOrUpdateProductType(row['producttype']);
        if (rslt.status) {
            // Add Or Update Product
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductProductType", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;

        } else { return; }

        // Add Product Other Details
        rslt = await Support.AddOrUpdateOtherDetails(row['otherdetails'], dropDownOptions);
        if (rslt.status) {
            // Add Or Update Product
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductOtherDetails", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;

        } else { return; }

        // Add Or Update Product Price
        rslt = await Support.AddOrUpdatePrice(row['productprice']);
        if (rslt.status) {
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductProductPrice", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;
        } else { return; }


        // Add Product Other Images
        prodImages = product.find((x) => x.key === 'OtherImages').value;
        for (let i = 0; i < prodImages.length; i++) {
            rslt = await Support.AddOrUpdateDocument({ value: prodImages[i] });
            if (rslt.status) {
                data = [
                    { key: "Product_id", value: parseInt(productId) },
                    { key: "DocId", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdateProductOtherImages(data);
                if (!rslt.status) return;
            }
        }

        // Add Product Main Image
        prodImages = product.find((x) => x.key === 'MainImage');
        rslt = await Support.AddOrUpdateDocument(prodImages);
        if (rslt.status) {
            data = [
                { key: "Product_id", value: parseInt(productId) },
                { key: "ProductMainImage", value: parseInt(rslt.id) }
            ];
            rslt = await Support.AddOrUpdateProduct(data, dropDownOptions);
            if (!rslt.status) return;
        } else { return; }


        global.AlertPopup("success", "Product is created successfully!");
        setShowUpdate(false);
        NavigateTo("/products");
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name);
        if (_index > -1) {
            _row[location][_index].value = value;
            setRow(_row);
            setShowUpdate(true);
        }
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const FetchProductTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            await Api.GetProductTypes()
                .then(async (res) => {
                    if (res.status) {
                        const pValues = res.values.map((x) => { return { Name: x.ProductTypeName, Value: x.PtId } });
                        await GetMetaDataInfo()
                            .then(async (res2) => {
                                const enums = res2.filter((x) => x.Type === 'Enum') || [];
                                enums.push({ Name: "ProductTypes", Type: 'Enum', Values: pValues });
                                setDropDownOptions(enums);
                                global.Busy(false);
                                return resolve(true);
                            });

                    } else {
                        global.Busy(false);
                        console.log(res.statusText);
                        return resolve(true);
                    }
                });

        });
    }

    const FetchProductDetails = async () => {
        let item = {};
        screenItems.forEach(elm => {
            let items = [];
            for (let prop of ProductJsonConfig[elm]) {
                items.push({ ...prop, value: null });
                //items.push({ ...prop });
            }
            item[elm] = items;
        });
        setRow(item);
    }

    const fetchData = async () => {
        await FetchProductTypes().then(async () => {
            await FetchProductDetails();
        });
    };

    useEffect(() => { setShowButton(true); }, []);
    if (initialized) { setInitialized(false); fetchData(); }
    useEffect(() => { setInitialized(true); }, []);

    return (

        <>
            <Container {...props}>
                <Box sx={{ width: '100%', height: 50 }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%" }}>
                            <Typography noWrap variant="subheader" component="div">
                                {title}
                            </Typography>
                        </Box>
                        <Grid container sx={{ justifyContent: 'flex-end' }}>
                            <Button variant="contained" startIcon={<ArrowLeftIcon />}
                                onClick={() => NavigateTo("/products")}
                            >Back</Button>
                        </Grid>
                    </Stack>
                </Box>
                <Divider />
                <RenderFormContols shadow={true} {...props} setForm={setForm} onInputChange={OnInputChange}
                    controls={row} onSubmit={OnSubmit} options={dropDownOptions} />
                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                {showButton && <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>}
                                <Button variant="outlined" onClick={() => NavigateTo("/products")}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container >
        </>

    );

};

export default Component;