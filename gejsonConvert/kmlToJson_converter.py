#!/bin/python3
import os
import xml.etree.ElementTree as ET
import json

# Function to convert KML coordinates to GeoJSON coordinates
def kml_to_geojson(kml_coordinates):
    coordinate_pairs = kml_coordinates.strip().split(" ")
    geojson_coordinates = []
    for pair in coordinate_pairs:
        longitude, latitude, _ = pair.split(",")
        geojson_coordinates.append([float(longitude), float(latitude)])
    return geojson_coordinates

# Function to save GeoJSON data to a JSON file with the same name as the source KML file
def save_to_json(kml_filename, geojson_data):
    # Extract the base filename without the extension
    base_filename = os.path.splitext(kml_filename)[0]
    json_filename = f"{base_filename}.json"
    with open(json_filename, "w") as json_file:
        json.dump({"type": "LineString", "coordinates": geojson_data}, json_file)

# Get a list of all KML files in the current directory
kml_files = [file for file in os.listdir("./") if file.endswith(".kml")]

if kml_files:
    for kml_file in kml_files:
        kml_file_path = os.path.join("./", kml_file)

        # Open and parse the KML file
        try:
            tree = ET.parse(kml_file_path)
            root = tree.getroot()

            # Find and extract the KML coordinates from the file
            kml_coordinates = ""
            for element in root.iter():
                if "coordinates" in element.tag:
                    kml_coordinates = element.text

            if kml_coordinates:
                # Convert KML coordinates to GeoJSON coordinates
                geojson_coordinates = kml_to_geojson(kml_coordinates)

                # Save the GeoJSON data to a JSON file
                save_to_json(kml_file_path, geojson_coordinates)

                print(f"Conversion and saving to JSON complete for {kml_file}.")
            else:
                print(f"No KML coordinates found in {kml_file}.")
        except Exception as e:
            print(f"An error occurred while processing {kml_file}: {e}")
else:
    print("No KML files found in the current directory.")