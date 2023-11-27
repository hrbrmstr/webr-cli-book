suppressPackageStartupMessages({
  library(ggplot2)
  library(sf)
  library(dplyr)
})

suppressWarnings(quakes <- st_read(quakes_json, quiet = TRUE))
suppressWarnings(land <- st_read("/data/ne_110m_admin_0_countries.geojson", crs = st_crs(quakes), quiet = TRUE))

png(
  filename = sprintf("/plots/%s-quakes.png", Sys.Date()),
  width = 1200, 
  height = 800,
  units = "px"
)

ggplot() +
  geom_sf(
    data = land,
    fill = "#e1e1e1",
    color = "#2b2b2b",
    linewidth = 0.125,
    size = 0.125
  ) +
  geom_sf(
    data = quakes,
    aes(size = mag, fill = mag),
    shape = 21,
    color = "white"
  ) +
  scale_fill_viridis_c(
    name = "Magnitude",
    option = "magma"
  ) +
  scale_radius(
    name = "Magnitude",
    trans = "sqrt"    
  ) +
  coord_sf(
    crs = "+proj=vandg4"
  ) +
  guides(
    size = guide_legend(override.aes = list(color = "black"))
  ) +
  labs(
    title = "Recent Quakes",
    subtitle = "Magnitude of 2.5 or higher that have been located by the USGS and contributing agencies within the last day",
    caption = sprintf("Source: <https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson>\nData download: %s", Sys.time())
  ) +
  theme_minimal(
    base_family = "Inter"
  ) +
  theme(
    plot.title = element_text(family = "Earthquake MF", size = 28, face = "bold", margin = margin(b=10)),
    plot.subtitle = element_text(size = 20, face = "plain", margin = margin(b=15)),
    plot.caption = element_text(margin = margin(t=10)),
    plot.margin = margin(30, 30, 30, 30),
    panel.background = element_rect(fill = "skyblue", color = "skyblue"),
    panel.grid.major = element_line(linewidth = 0.25)
  ) -> gg

plot(gg)

dev.off()