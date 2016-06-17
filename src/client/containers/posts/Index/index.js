import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from 'clientActions/posts';
import Item from 'clientComponents/posts/indexes/Item/index';
import styles from'./styles.scss';
import Infinite from 'react-infinite';


const propTypes = {
  posts: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  fetchPosts: PropTypes.func.isRequired
};

class PostIndex extends Component {
  
  constructor(props) {
    super(props);

    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount() {
    let params = {};
    if (this.props.hasOwnProperty("location")) {
      params.tag = this.props.location.query.tag
    }
    this.props.fetchPosts(params);
  }

  componentWillReceiveProps (nextProps) {
    // TODO: figure out how to insert hyphen in the queries so that the query changes from tag to tag-id
    if (nextProps.location.query.tag !== this.props.location.query.tag) {
      nextProps.fetchPosts({ tag: nextProps.location.query.tag })
    }
  }
  
  handleLoad() {
    if (this.canLoad()) {
      let params = { page: this.props.page + 1 };
      
      if (this.props.params.hasOwnProperty("location")) {
        params.tag = this.props.params.location.query.tag
      }
      this.props.fetchPosts(params);
    }
  }

  canLoad() {
    return (this.props.total - (this.props.limit * this.props.page)) > 0
  }

  renderItems() {
    return (
      <Infinite
        className={styles.list}
        infiniteLoadBeginEdgeOffset={400}
        onInfiniteLoad={this.handleLoad}
        containerHeight={700}
        elementHeight={100}
        useWindowAsScrollContainer
      >
        {this.props.posts.map((post) => {
          return <Item key={post.id} post={post} />;
        })}
      </Infinite>
    );
  }

  render() {
    if(!this.props.posts || this.props.posts.length === 0 ) {
      return <section className={styles.root} />
    }
    return (
      <section className={styles.root}>
        <h1 className={styles.title}>Posts</h1>
        {this.renderItems()}
      </section>
    );
  }
}

PostIndex.propTypes = propTypes;

function mapStateToProps(state) {
  return { 
    posts: state.posts.posts, 
    page: state.posts.page, 
    limit: state.posts.limit, 
    total: state.posts.total 
  }
}

export default connect(mapStateToProps, { fetchPosts })(PostIndex);