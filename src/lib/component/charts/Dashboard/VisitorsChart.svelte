<canvas height="120" id="visitorsChart"></canvas>

<script>
  // import Chart from "chart.js";
  import { onMount } from "svelte";

  onMount(() => {
    // const ctx = document.getElementById("visitorsChart");
    // const visitorsChart = new Chart(ctx, {
    //   type: "line",
    //   data: {
    //     labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    //     datasets: [
    //       {
    //         data: [5, 12, 8, 15, 19, 19, 22],
    //         borderColor: "#1976d2",
    //         backgroundColor: "rgba(25, 118, 210, .05)",
    //         borderWidth: 2,
    //         pointRadius: 5,
    //         pointBackgroundColor: "#fff",
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [
    //         {
    //           ticks: {
    //             fontColor: "#aab2bd",
    //             beginAtZero: true,
    //           },
    //           gridLines: {
    //             drawTicks: false,
    //             display: true,
    //           },
    //           display: true,
    //         },
    //       ],
    //       xAxes: [
    //         {
    //           ticks: {
    //             fontColor: "#aab2bd",
    //             beginAtZero: true,
    //           },
    //           gridLines: {
    //             drawTicks: false,
    //             display: false,
    //           },
    //           display: true,
    //         },
    //       ],
    //     },
    //     legend: {
    //       display: false,
    //     },
    //   },
    // });
  });
</script>
