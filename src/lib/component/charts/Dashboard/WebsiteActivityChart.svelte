<canvas height="120" id="websiteActivityChart" bind:this="{element}"></canvas>

<script>
  import Chart from "chart.js/auto";
  import "chartjs-adapter-date-fns";
  import { onMount } from "svelte";
  import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
  import { DashboardPeriod } from "$lib/pages/Dashboard.svelte";

  let element;
  let chart;
  let minDate;
  let maxDate;
  let displayFormats;
  export let newRegisterData;
  export let ticketsData;
  export let visitorData;
  export let viewData;
  export let period;

  const weekConfiguration = { weekStartsOn: 1 };

  $: {
    const currentDate = new Date();

    if (period === DashboardPeriod.WEEK) {
      minDate = startOfWeek(currentDate, weekConfiguration).getTime();
      maxDate = endOfWeek(currentDate, weekConfiguration).getTime();

      displayFormats = { "day": "eee" }
    } else {
      minDate = startOfMonth(currentDate).getTime();
      maxDate = endOfMonth(currentDate).getTime();

      displayFormats = { "day": "dd, eee" }
    }

    if (chart) {
      reloadChart();
    }
  }

  function convertDataForChartJS(data) {
    const newData = [];

    if (data) {
      Object.keys(data).forEach((key) => {
        newData.push({ x: Number(key), y: data[key] });
      });
    }

    return newData;
  }

  function getSuggestedMax(datasets) {
    let highestValue = 0;

    Object.values(datasets).forEach((dataset) => {
      dataset.forEach((data) => {
        if (data["y"] > highestValue) {
          highestValue = data["y"];
        }
      })
    });

    return highestValue + 5;
  }

  function getConvertedDatasets() {
    const convertedNewRegisterData = convertDataForChartJS(newRegisterData);
    const convertedTicketsData = convertDataForChartJS(ticketsData);
    const convertedVisitorData = convertDataForChartJS(visitorData);
    const convertedViewData = convertDataForChartJS(viewData);

    return {
      convertedNewRegisterData,
      convertedTicketsData,
      convertedVisitorData,
      convertedViewData,
    };
  }

  function getDatasets(convertedDatasets) {
    const {
      convertedNewRegisterData,
      convertedTicketsData,
      convertedVisitorData,
      convertedViewData,
    } = convertedDatasets;

    return [
      {
        label: "Yeni Kayıt",
        data: convertedNewRegisterData,
        borderColor: "orange",
        backgroundColor: "rgba(25, 118, 210, .05)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
      },
      {
        label: "Yeni Talep",
        data: convertedTicketsData,
        borderColor: "purple",
        backgroundColor: "rgba(25, 118, 210, .05)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
      },
      {
        label: "Ziyaretçi",
        data: convertedVisitorData,
        borderColor: "red",
        backgroundColor: "rgba(25, 118, 210, .05)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
      },
      {
        label: "Görüntülenme",
        data: convertedViewData,
        borderColor: "green",
        backgroundColor: "rgba(25, 118, 210, .05)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#fff",
      },
    ];
  }

  function reloadChart() {
    const convertedDatasets = getConvertedDatasets();

    chart.data.datasets = getDatasets(convertedDatasets);

    chart.options.scales.x.min = minDate;
    chart.options.scales.x.max = maxDate;
    chart.options.scales.x.time.displayFormats = displayFormats;

    chart.options.scales.y.suggestedMax = getSuggestedMax(convertedDatasets);

    chart.update();
  }

  function renderChart() {
    const convertedDatasets = getConvertedDatasets();

    const suggestedMax = getSuggestedMax(convertedDatasets);

    chart = new Chart(element, {
      type: "line",
      data: {
        datasets: getDatasets(convertedDatasets),
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats,
              isoWeekday: true,
              padding: 5,
            },
            min: minDate,
            max: maxDate,
            offset: true,
          },
          y: {
            suggestedMax: suggestedMax,
            ticks: {
              precision: false,
            },
          },
        },
      },
    });
  }

  onMount(() => {
    renderChart();
  });
</script>
