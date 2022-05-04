module.exports = {
  // this helper will help us transform the data the we will get from the user data to a desired formating 
  format_date: date => {
    
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
      date
    ).getFullYear()}`
  },

  // this helper will help us transform the  word point to points whenever the vote_count is greater than 1
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },

  // this helper will help us transform the URL that we got from the post_url to be easy to read 
  format_url: url => {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')[0]
      .split('?')[0];
  },
}