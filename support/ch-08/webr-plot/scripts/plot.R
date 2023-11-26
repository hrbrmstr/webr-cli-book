suppressPackageStartupMessages({
  library(ggplot2)
})

png("/plots/mtcars.png", width = 512, height = 512, units = "px")

ggplot() +
  geom_point(
    data = mtcars,
    aes(x = mpg, y = disp)
  ) +
  labs(
    title = "Inter Via JS"
  ) +
  theme_minimal(
    base_family = "Inter"
  ) +
  theme(
    plot.title = element_text(size = 48, face = "bold")
  ) -> gg

plot(gg)

dev.off()