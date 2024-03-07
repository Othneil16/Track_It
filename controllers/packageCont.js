const companyModel = require('../models/companyMod');
const userModel = require('../models/userModel');
const packageModel = require('../models/packageMod'); 
 


const generateFirstUniqueId = (length)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const generateSecondUniqueId = (length)=> {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// const { Client } = require('@googlemaps/google-maps-services-js');

// // Initialize the Google Maps client
// const client = new Client({});

// // Function to validate an address using Google Maps Geocoding API
// async function isValidAddress(address) {
//     try {
//         // Send a geocoding request to Google Maps Geocoding API
//         const response = await client.geocode({
//             params: {
//                 address: address,
//                 region: 'NG', // Restrict results to Nigeria
//                 key: 'YOUR_GOOGLE_MAPS_API_KEY' // Replace with your Google Maps API key
//             }
//         });

//         // Check if the response contains any results
//         if (response.data.results.length > 0) {
//             // Address is valid
//             return true;
//         } else {
//             // No results found, address is invalid
//             return false;
//         }
//     } catch (error) {
//         console.error('Error validating address:', error);
//         return false; // Return false in case of any errors
//     }
// }


const axios = require('axios');

exports.convertAddressToCoordinates = (address) => {
    
    try {
        if (!address) {
            return res.status(400).json({
                message: 'Address is required in the request body.'
            })
        }
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`

        const response = axios.get(apiUrl)
        .then((data)=>{
          return data
      })
      .catch((error)=> console.log(error.message
        ))
      
        // Check if the response contains data
        if (!response.data || response.data.length === 0) {
            return res.status(400).json({
                message: 'Unable to find coordinates for the provided address.'
            });
        }

        // Extract latitude and longitude from the first result
        const { lat, lon } = response.data[0];

        // Respond with the coordinates
        return res.status(200).json({
            message: 'Address converted to coordinates successfully.',
            coordinates: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            }
        });
    } catch (error) {
        // Handle errors and respond with an error message
        console.error('Geocoding error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


exports.createPackage = async (req, res) => {
    try {

        const { userId } = req.user;
        const {companyId} = req.params

        // Retrieve company from the database
        const user = await userModel.findById(userId);

        const company = await companyModel.findById(companyId)
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            });
        }
        if (!company) {
            return res.status(404).json({
                message: 'company not found'
            });
        }
    

        // Check if company is verified

        const { packageWeight, departure, destination, packageName} = req.body;

        
        const address = destination
        isValidAddress(address)
    .then(valid => {
        if (valid) {
            console.log('Address is valid');
        } else {
            console.log('Address is invalid');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
        
    let uniqueId;
    let isUniqueId = false;
    while (!isUniqueId) {
        uniqueId = generateUniqueId(5);

        const existingPackage = await packageModel.findOne({ packageId: uniqueId });
        if (!existingPackage) {
            isUniqueId = true;
        }
    }
       
        // Create the package
        const package = new packageModel({
            packageWeight,
            departure,
            destination,
            user: req.user._id,
            packageId: uniqueId,
            packageName
        });

        const savedPackage = await package.save();
        
        company.pendingPackages.push(package._id)
        company.companyPackages.push(package._id)

        await company.save()

        return res.status(201).json({
            message: "Package created successfully",
            package: savedPackage
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


// exports.createPackage = async (req, res) => {
//     try {
//         const { userId } = req.user;

//         // Retrieve user from the database
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found'
//             });
//         }

//         const { packageWeight, departure, destination } = req.body;

//         // Validate if destination is within Lagos
//         const isValidDestination = await isValidLagosAddress(destination);
//         if (!isValidDestination) {
//             return res.status(400).json({
//                 message: 'Destination must be a valid address within Lagos'
//             });
//         }

//         // Create the package
//         const package = new packageModel({
//             packageWeight,
//             departure,
//             destination,
//             user: req.user._id
//         });

//         // Save the package to the database
//         const savedPackage = await package.save();

//         return res.status(201).json({
//             message: 'Package created successfully',
//             package: savedPackage
//         });
//     } catch (error) {
//         return res.status(500).json({
//             error: error.message
//         });
//     }
// };



// Example usage

exports.createNewPackage = async (req, res) => {
    try {

        const {companyId} = req.company
        const company = await companyModel.findById(companyId)
        if (!company) {
            return res.status(404).json({
                message: 'company not found'
            });
        }
        if (company.isVerified !== true) {
            return res.status(404).json({
                message: `ooops!!, can't perform action. Company not verified`
            });
        }

        const { packageWeight, departure, packageName} = req.body;

        
    //     const address = destination
    //     isValidAddress(address)
    // .then(valid => {
    //     if (valid) {
    //         console.log('Address is valid');
    //     } else {
    //         console.log('Address is invalid');
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
        
    let uniqueId;
    let isUniqueId = false;
    while (!isUniqueId) {
        uniqueId = generateSecondUniqueId(5);

        const existingPackage = await packageModel.findOne({ packageId: uniqueId });
        if (!existingPackage) {
            isUniqueId = true;
        }
    }
       
        // Create the package
        const package = new packageModel({
            packageWeight,
            departure,
            packageId: uniqueId,
            packageName
        });

        const savedPackage = await package.save();
        
        company.pendingPackages.push(package._id)
        await company.save()

        return res.status(201).json({
            message: "Package created successfully",
            package: savedPackage
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


exports.packageDestination = async (req, res) => {
    try {
        const { newDestination } = req.body
        const {companyId} = req.company
        const {packageId} = req.params
        
       // Retrieve company from the database
       const company = await companyModel.findById(companyId);
       if (!company) {
           return res.status(404).json({
               message: 'Company not found'
           });
       }
       
        if (company.isVerified !== true) {
            return res.status(400).json({
                error: "Company not verified"
            });
        }   
        
        // Check if packageId and newDestination are provided
        if (!packageId || !newDestination) {
            return res.status(400).json({
                error: 'Both packageId and newDestination are required fields.'
            });
        }

        // Find the package in the database
        const package = await packageModel.findById(packageId);

        // Check if the package exists
        if (!package) {
            return res.status(404).json({
                error: 'Package not found.'
            });
        }

        if (!company.unassignedPackages.includes(packageId)) {
            return res.status(400).json({
                error: 'The provided package ID is not among the unassigned packages of the company.'
            });
        }

        // Update the package destination
        package.destination = newDestination;
        
        // Save the updated package
        await package.save();

        return res.status(200).json({
            message: 'Package destination updated successfully.',
            package: package // Optionally, you can send back the updated package object
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};
