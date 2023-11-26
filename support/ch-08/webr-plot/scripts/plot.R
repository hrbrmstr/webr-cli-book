suppressPackageStartupMessages({
  library(ggplot2)
  library(sf)
  library(dplyr)
})

quakes <- st_read(quakes_json, quiet=TRUE)
land <- st_read("/data/ne_110m_admin_0_countries.geojson", crs = st_crs(quakes))

png("/plots/quakes.png", width = 1800, height = 1200, units = "px")

ggplot() +
  geom_sf(
    data = land,
    fill = "#c3c3c3",
    linewidth = 0.125,
    color = "#3c3c3c"
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
  scale_size_continuous(
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
    base_family = "Quakes"
  ) +
  theme(
    panel.background = element_rect(fill = "skyblue", color = "skyblue"),
    plot.title = element_text(family = "Earthquake MF", size = 28, face = "bold", margin = margin(b=10)),
    plot.subtitle = element_text(size = 20, face = "plain", margin = margin(b=15)),
    plot.caption = element_text(margin = margin(t=10)),
    plot.margin = margin(30, 30, 30, 30)
  ) -> gg

plot(gg)

dev.off()