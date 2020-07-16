<template>
  <div class="hello">
    <table>
      <thead>
        <tr>
          <th v-for="key in columns" v-bind:key="key">
            {{ key | capitalize}}
            <span class="arrow" >
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, idx) in plugins" v-bind:key="idx">
          <td v-for="key in columns" v-bind:key="key">
            <template v-if="key === 'secureDownloadUrl'">
              <a :href="entry[key][0]">Download</a>
            </template>
            <template v-else-if="key === 'helpURL' && typeof entry[key] !== 'undefined'">
              <a :href="entry[key][0]" target="_blank">Help</a>
            </template>
            <template v-else>
              {{ entry[key] | getFirstIfExists }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
import axios from 'axios'
import xml2js from 'xml2js'

export default {
  name: 'Catalog',
  data: () => {
    return {
      plugins: [],
      columns: ["pluginName", "label", "category", "pluginVersion", "description", "helpURL", "secureDownloadUrl"]
    }
  },
  mounted() {
    var vm = this
    axios({
      method: 'get',
      url: '/plugins/catalog.xml',
      headers: {'Content-type': 'application/xml'}
    })
    .then(response =>
        xml2js.parseString(response.data, (err, result) => {
          if(err) {
            //Do something
          } else {
            vm.plugins = result.plugins.plugin
          }
        }
        )
      )
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    getFirstIfExists: function(str) {
      if (typeof str !== 'undefined') {
        return str[0]
      } else {
        return '';
      }
    }
  },
  methods: {
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  border: 2px solid #289CE1;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #006AB0;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}

</style>
