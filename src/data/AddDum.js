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
            compna_name: "Toyota",
            model: "Camry",
            mileage: "35,000 miles",
            color: "Silver",
            condition: "Used",
            number: "XYZ1234",
            owner_id: userId,
            engine_type: "V6",
            price: "20,000",
            register_date: "2020-01-15",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Honda",
            model: "Civic",
            mileage: "25,000 miles",
            color: "Blue",
            condition: "Used",
            number: "ABC5678",
            owner_id: userId,
            engine_type: "I4",
            price: "18,000",
            register_date: "2019-05-10",
            status: "available",
            transmission: "Manual",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Ford",
            model: "Mustang",
            mileage: "15,000 miles",
            color: "Red",
            condition: "New",
            number: "MNO3456",
            owner_id: userId,
            engine_type: "V8",
            price: "35,000",
            register_date: "2021-03-22",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Chevrolet",
            model: "Malibu",
            mileage: "45,000 miles",
            color: "White",
            condition: "Used",
            number: "JKL7890",
            owner_id: userId,
            engine_type: "I4",
            price: "16,000",
            register_date: "2018-07-11",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Nissan",
            model: "Altima",
            mileage: "30,000 miles",
            color: "Black",
            condition: "Used",
            number: "UVW2345",
            owner_id: userId,
            engine_type: "I4",
            price: "17,000",
            register_date: "2019-11-05",
            status: "available",
            transmission: "CVT",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "BMW",
            model: "3 Series",
            mileage: "20,000 miles",
            color: "Gray",
            condition: "Certified Pre-Owned",
            number: "QRS6789",
            owner_id: userId,
            engine_type: "I6",
            price: "30,000",
            register_date: "2020-08-19",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Mercedes-Benz",
            model: "C-Class",
            mileage: "12,000 miles",
            color: "Silver",
            condition: "New",
            number: "TUV3456",
            owner_id: userId,
            engine_type: "I4",
            price: "40,000",
            register_date: "2021-10-01",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Audi",
            model: "A4",
            mileage: "22,000 miles",
            color: "Blue",
            condition: "Certified Pre-Owned",
            number: "LMN7890",
            owner_id: userId,
            engine_type: "I4",
            price: "32,000",
            register_date: "2020-04-15",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Lexus",
            model: "ES",
            mileage: "10,000 miles",
            color: "Red",
            condition: "New",
            number: "FGH2345",
            owner_id: userId,
            engine_type: "V6",
            price: "45,000",
            register_date: "2022-02-10",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Gasoline",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
        },
        {
            compna_name: "Tesla",
            model: "Model 3",
            mileage: "5,000 miles",
            color: "White",
            condition: "New",
            number: "OPQ6789",
            owner_id: userId,
            engine_type: "Electric",
            price: "50,000",
            register_date: "2021-12-20",
            status: "available",
            transmission: "Automatic",
            fuel_type: "Electric",
            image_url: " https://firebasestorage.googleapis.com/v0/b/car-dealers-bffbe.appspot.com/o/user%2F39f5b20a-29df-4f5f-9dc4-e9a7c887d4a1?alt=media&token=ad0634cf-8c50-4528-b8a4-b26ca353dca4",
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