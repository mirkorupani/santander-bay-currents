
import xarray as xr
import cartopy.crs as ccrs
import json


def getPoints():

    with open("static/config.json") as f:
        config = json.load(f)

    # Load the data
    ds = xr.open_dataset(config["nc_files"][0])
    ds = ds.Station

    # Define the projection for the data
    data_projection = ccrs.UTM(zone=30)

    # Project the points
    ds.x.values, ds.y.values = ccrs.PlateCarree().transform_points(data_projection, ds.x.values, ds.y.values)[:, :2].T

    return [
        {
            "id": int(sta), 
            "name": name.item(),  # Convert numpy string to Python string
            "latitude": float(lat),  # Convert to Python float
            "longitude": float(lon)  # Convert to Python float
        }
        for sta, name, lat, lon in zip(
            ds.Station.values, 
            ds.platform_name.values, 
            ds.y.values, 
            ds.x.values
        )
    ]
