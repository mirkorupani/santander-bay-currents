from fastapi import APIRouter, HTTPException
from app.models import MetricsRequest, MetricsResponse
import numpy as np

router = APIRouter()

@router.post("/metrics", response_model=MetricsResponse)
def get_metrics(request: MetricsRequest):
    try:
        # Convert request data to numpy arrays
        y_u_x = np.array(request.y_u_x)
        yPred_u_x = np.array(request.yPred_u_x)
        y_u_y = np.array(request.y_u_y)
        yPred_u_y = np.array(request.yPred_u_y)
        y_waterlevel = np.array(request.y_waterlevel)
        yPred_waterlevel = np.array(request.yPred_waterlevel)
        
        # Calculate metrics
        return MetricsResponse(

            mae_u_x=np.mean(np.abs(y_u_x - yPred_u_x)),
            bias_u_x=np.mean(yPred_u_x - y_u_x),
            pearson_u_x=np.corrcoef(y_u_x, yPred_u_x)[0, 1],

            mae_u_y=np.mean(np.abs(y_u_y - yPred_u_y)),
            bias_u_y=np.mean(yPred_u_y - y_u_y),
            pearson_u_y=np.corrcoef(y_u_y, yPred_u_y)[0, 1],

            mae_waterlevel=np.mean(np.abs(y_waterlevel - yPred_waterlevel)),
            bias_waterlevel=np.mean(yPred_waterlevel - y_waterlevel),
            pearson_waterlevel=np.corrcoef(y_waterlevel, yPred_waterlevel)[0, 1]

        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))