<canvas height="120" id="websiteActivityChart" bind:this="{element}"></canvas>

<script>
  import Chart from "chart.js/auto/auto.esm";
  import "chartjs-adapter-date-fns";
  import { onMount } from "svelte";

  let element;
  let chart;
  export let newRegisterData;
  export let ticketsData;
  export let visitorData;
  export let viewData;

  function convertDataForChartJS(data) {
    const newData = [];

    Object.keys(data).forEach((key) => {
      newData.push({ x: Number(key), y: data[key] });
    });

    return newData;
  }

  onMount(() => {
    const visitorsChart = new Chart(element, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Yeni Kayıt",
            data: convertDataForChartJS(newRegisterData),
            borderColor: "orange",
            backgroundColor: "rgba(25, 118, 210, .05)",
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: "#fff",
          },
          {
            label: "Yeni Talep",
            data: convertDataForChartJS(ticketsData),
            borderColor: "purple",
            backgroundColor: "rgba(25, 118, 210, .05)",
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: "#fff",
          },
          {
            label: "Ziyaretçi",
            data: convertDataForChartJS(visitorData),
            borderColor: "red",
            backgroundColor: "rgba(25, 118, 210, .05)",
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: "#fff",
          },
          {
            label: "Görüntülenme",
            data: convertDataForChartJS(viewData),
            borderColor: "green",
            backgroundColor: "rgba(25, 118, 210, .05)",
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: "#fff",
          },
        ],
      },
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0
          }
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: { "day": "eee" },
              isoWeekday: true,
              padding: 5
            },
            min: "2022-07-29 00:00:00",
            max: "2022-08-04 00:00:00",
            offset: true
          },
          y: {
            suggestedMax: 20,
            ticks: {
              precision: false
            },
          },
        },
      },
    });
  });
</script>
