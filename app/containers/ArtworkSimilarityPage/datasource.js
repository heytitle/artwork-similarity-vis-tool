
module.exports.datasource = {
    datasets: [
        {
            key: 'moma-artworks',
            desc: 'MoMa Artwork (5000 Artworks)'
        },
        {
            key: 'moma-artworks-1000',
            desc: 'MoMa Artwork (1000 Artworks) with manipulation'
        }
    ],
    architectures: [
        {
            key: 'resnet152',
            desc: 'ResNet152'
        },
        {
            key: 'vgg16',
            desc: 'VGG16'
        },
        {
            key: 'densenet',
            desc: 'DenseNet'
        },
    ],
    mapping: {
        'moma-artworks-1000--vgg16':     'https://s3.amazonaws.com/pchormai-public/artwork-similarity/nn-from-vgg16-moma-artworks-1000--2018-12-26-10-01-39.npy.json',
        'moma-artworks-1000--resnet152': 'https://s3.amazonaws.com/pchormai-public/artwork-similarity/nn-from-resnet152-moma-artworks-1000--2018-12-26-09-54-07.npy.json',
        'moma-artworks-1000--densenet':  'https://s3.amazonaws.com/pchormai-public/artwork-similarity/nn-from-densenet-moma-artworks-1000--2018-12-26-09-56-26.npy.json',

        'moma-artworks--vgg16':          'https://s3.amazonaws.com/pchormai-public/artwork-similarity/nn-from-vgg16-moma-artworks--2018-12-25-14-40-03.npy.json',
        'moma-artworks--resnet152':      'https://s3.amazonaws.com/pchormai-public/artwork-similarity/nn-from-resnet152-moma-artworks--2018-12-25-14-42-36.npy.json',
        'moma-artworks--densenet':       'https://s3.amazonaws.com/pchormai-public/artwork-similarity/nn-from-densenet-moma-artworks--2018-12-25-14-48-51.npy.json'
    }
};