import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
  Grid,
  Chip,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for design
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-5px)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const DataDisplay = ({ title, data, type }) => {
  return (
    <StyledCard>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        {type === "restaurant" && (
          <Box>
            {Object.entries(data).map(([key, value]) => (
              <Box key={key} mb={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {type === "menu" && (
          <Grid container spacing={2}>
            {Object.entries(data).map(([foodId, item]) => (
              <Grid item xs={12} sm={6} md={4} key={foodId}>
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${item.price}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Available Times:
                      </Typography>
                      <StyledChip
                        label={item.morning ? "Morning" : "Not Available"}
                        color={item.morning ? "success" : "default"}
                        variant="outlined"
                      />
                      <StyledChip
                        label={item.noon ? "Noon" : "Not Available"}
                        color={item.noon ? "success" : "default"}
                        variant="outlined"
                      />
                      <StyledChip
                        label={item.evening ? "Evening" : "Not Available"}
                        color={item.evening ? "success" : "default"}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}

        {type === "maintenance" && (
          <Box>
            <Typography variant="h6">Maintenance Details</Typography>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Maintenance Date:</strong>
              </Typography>
              <Typography variant="body1">{data.maintenanceData}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Maintenance Price:</strong>
              </Typography>
              <Typography variant="body1">${data.maintenancePrice}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Maintenance Description:</strong>
              </Typography>
              <Typography variant="body1">
                {data.maintenanceDescription}
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Expected Completion Date:</strong>
              </Typography>
              <Typography variant="body1">
                {data.maintenanceExpectData}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default DataDisplay;
