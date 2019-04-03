#!/usr/bin/env sh
hexo clean
hexo g -d
export HEXO_ALGOLIA_INDEXING_KEY=5489ac7ce78f59f4a8cb5445035f54d8
hexo algolia
