export default {
  community: {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: './lib/api/',
      client: 'react-query', 
      baseUrl: 'http://localhost:8080',
      override: {
        mutator: {
          path: './lib/axios.ts',
          name: 'customAxios',
        },
      },
    },
  },
};
