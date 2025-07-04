import { ChartJSNodeCanvas, type ChartCallback } from "chartjs-node-canvas";
import type { ChartConfiguration } from "chart.js/auto";
import path from "path";
import { promises as fs } from "fs";
import { DateTime, Duration } from "luxon";
import YAML from "yaml";

const contentPath = path.join(process.cwd(), "src", "content", "psychoactives");

async function readContent() {
  try {
    const files = await fs.readdir(contentPath);
    const entries = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(contentPath, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data = content.split("---")[1];
        const parsed = YAML.parse(data);
        parsed.slug = file.replace(".mdx", "");
        return parsed;
      })
    );
    return entries;
  } catch (error) {
    console.error("Error reading content:", error);
  }
}

interface DurationChart {
  onset: string;
  coming_up: string;
  plateau: string;
  coming_down: string;
}

interface ChartDataPoint {
  x: number;
  y: number;
}

async function writeChart(slug: string, duration_chart: DurationChart): Promise<void> {
  const now = DateTime.fromISO("12:00");
  let onset: Duration = Duration.fromISO("PT" + duration_chart.onset.toUpperCase());
  let coming_up: Duration = Duration.fromISO(
    "PT" + duration_chart.coming_up.toUpperCase()
  );
  let plateau: Duration = Duration.fromISO("PT" + duration_chart.plateau.toUpperCase());
  let coming_down: Duration = Duration.fromISO(
    "PT" + duration_chart.coming_down.toUpperCase()
  );
  let max: DateTime = now.plus(onset).plus(coming_up).plus(plateau).plus(coming_down);

  let chart_data: ChartDataPoint[] = [
    { x: now.toMillis(), y: 0 },
    { x: now.plus(onset).toMillis(), y: 0 },
    { x: now.plus(onset).plus(coming_up).toMillis(), y: 1 },
    { x: now.plus(onset).plus(coming_up).plus(plateau).toMillis(), y: 1 },
    { x: max.toMillis(), y: 0 },
  ];
  Duration.fromISO("PT23H");
  let total_duration_in_seconds: number = (max.toMillis() - now.toMillis()) / 1000;

  function x_label_seconds(seconds: number): string {
    return `${seconds} secs`;
  }
  function x_label_minutes(seconds: number): string {
    let display = Math.floor(seconds / 60);
    return `${display} mins`;
  }
  function x_label_hours(seconds: number): string {
    let display = Math.floor(seconds / 3600);
    return `${display} hrs`;
  }

  function x_label(timestamp: number): string {
    let diff = (timestamp - now.toMillis()) / 1000;
    if (total_duration_in_seconds < 400) {
      return x_label_seconds(diff);
    }
    if (total_duration_in_seconds < 20000) {
      return x_label_minutes(diff);
    }
    return x_label_hours(diff);
  }

  const width = 900;
  const height = 450;
  const configuration: ChartConfiguration = {
    type: "line",
    data: {
      datasets: [
        {
          label: "Typical",
          data: chart_data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          cubicInterpolationMode: "monotone",
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          display: false,
          grid: {
            display: false,
          },
        },
        x: {
          type: "time",
          grid: {
            display: false,
          },

          ticks: {
            callback: function (val: number) {
              return x_label(val);
            },
            maxTicksLimit: 10,
            major: {
              enabled: true,
            },
            font: {
              size: 24,
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 36,
            },
          },
        },
      },
    },
    plugins: [
      {
        id: "background-colour",
        beforeDraw: (chart: any) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        },
      },
    ],
  };
  const chartCallback: ChartCallback = (ChartJS: any) => {
    ChartJS.defaults.responsive = true;
    ChartJS.defaults.maintainAspectRatio = false;
  };

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    plugins: {
      requireLegacy: ["chartjs-adapter-luxon"],
    },
    chartCallback,
  });
  const buffer: Buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  await fs.mkdir(path.join(process.cwd(), "public", "charts"), {
    recursive: true,
  });
  await fs.writeFile(`./public/charts/${slug}.png`, buffer, "base64");
}

async function main(): Promise<void> {
  const psychoactives = await readContent();
  for (const psychoactive of psychoactives) {
    const slug = psychoactive.slug;
    const duration_chart = psychoactive.duration_chart;
    await writeChart(slug, duration_chart);
  }
}
main();
