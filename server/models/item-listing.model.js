'use strict';

const mongoose = require('mongoose');

const itemListingSchema = new mongoose.Schema({
  owner: String,
  make: String,
  model: String,
  year: String,
  price: Number,
  pictures: [],
  offers: [],
  exteriorColor: String,
  interiorColor: String,
  engineTorque: Number,
  enginePower: Number,
  history: String,
  createdOn: Date,
  isActive: Boolean
});

let ItemListing;
itemListingSchema.static('createItemListing', function (listing) {
  if(!listing.pictures || listing.pictures.length === 0){
    listing.pictures = [{
      imageUrl: '/assets/default-image.jpeg'
    }];
  }
  return new ItemListing({
    owner: listing.owner,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    price: listing.price,
    pictures: listing.pictures || [],
    offers: [],
    exteriorColor: listing.exteriorColor,
    interiorColor: listing.interiorColor,
    engineTorque: listing.engineTorque,
    enginePower: listing.enginePower,
    history: listing.history,
    createdOn: new Date(),
    isActive: true
  });
});

mongoose.model('ItemListing', itemListingSchema);
ItemListing = mongoose.model('ItemListing');

module.exports = function ({}) {
  return ItemListing;
};