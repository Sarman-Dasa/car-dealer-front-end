// insertData.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../components/firebase/Firebase";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

export default function AddDum() {

    const userInfo = useSelector((state) => state.app.user);
    const userId = userInfo.id;
    const vehicles = [
        {
            company_name: "Toyota",
            model: "Camry",
            mileage: "35000",
            color: "Silver",
            condition: "Used",
            number: "XYZ1234",
            owner_id: userId,
            engine_type: "V6",
            price: "20000",
            register_date: "2020-01-15",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e",
        },
        {
            company_name: "Honda",
            model: "Civic",
            mileage: "25000",
            color: "Blue",
            condition: "Used",
            number: "ABC5678",
            owner_id: userId,
            engine_type: "I4",
            price: "18000",
            register_date: "2019-05-10",
            status: "available",
            transmission: "Manual",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Ford",
            model: "Mustang",
            mileage: "15000",
            color: "Red",
            condition: "New",
            number: "MNO3456",
            owner_id: userId,
            engine_type: "V8",
            price: "35000",
            register_date: "2021-03-22",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Chevrolet",
            model: "Malibu",
            mileage: "45000",
            color: "White",
            condition: "Used",
            number: "JKL7890",
            owner_id: userId,
            engine_type: "I4",
            price: "16000",
            register_date: "2018-07-11",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Nissan",
            model: "Altima",
            mileage: "30000",
            color: "Black",
            condition: "Used",
            number: "UVW2345",
            owner_id: userId,
            engine_type: "I4",
            price: "17000",
            register_date: "2019-11-05",
            status: "available",
            transmission: "CVT",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "BMW",
            model: "3 Series",
            mileage: "20000",
            color: "Gray",
            condition: "Certified Pre-Owned",
            number: "QRS6789",
            owner_id: userId,
            engine_type: "I6",
            price: "30000",
            register_date: "2020-08-19",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Mercedes-Benz",
            model: "C-Class",
            mileage: "12000",
            color: "Silver",
            condition: "New",
            number: "TUV3456",
            owner_id: userId,
            engine_type: "I4",
            price: "40000",
            register_date: "2021-10-01",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Audi",
            model: "A4",
            mileage: "22000",
            color: "Blue",
            condition: "Certified Pre-Owned",
            number: "LMN7890",
            owner_id: userId,
            engine_type: "I4",
            price: "32000",
            register_date: "2020-04-15",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Lexus",
            model: "ES",
            mileage: "10000",
            color: "Red",
            condition: "New",
            number: "FGH2345",
            owner_id: userId,
            engine_type: "V6",
            price: "45000",
            register_date: "2022-02-10",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
        {
            company_name: "Tesla",
            model: "Model 3",
            mileage: "5000",
            color: "White",
            condition: "New",
            number: "OPQ6789",
            owner_id: userId,
            engine_type: "Electric",
            price: "50000",
            register_date: "2021-12-20",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Electric",
            image_url: "https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/imagesThumbnail%2Ff0becb70-21cb-4337-890e-e3267488da5f?alt=media&token=71bf9420-62b7-47e8-93e8-efa57397167e"
        },
    ];

    async function insertCarDetail() {
        try {
            const collectionRef = collection(db, "cars");
            vehicles.forEach(async (vehicle) => {
                await addDoc(collectionRef, vehicle);
            });
            console.log("Data inserted successfully");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <Button onClick={insertCarDetail}>Add Data</Button>
    )
}
