// Auto-generated by gulp-svg-sprites

@mixin svg($name, $pseudo: false, $display: inline-block) {
    @if($pseudo) {
        &:#{$pseudo} {
            @include svg--content($name, $display);
        }
    } @else {
        @include svg--content($name, $display);
    }
}

@mixin svg--content($name, $display: inline-block) {
    {{#cssPathNoSvg}}
    background-image: url('{{{cssPathNoSvg}}}');
    background-image: url('{{{cssPathSvg}}}'), none; // scss-lint:disable DuplicateProperty
    {{/cssPathNoSvg}}
    {{^cssPathNoSvg}}
    background-image: url('{{{cssPathSvg}}}');
    {{/cssPathNoSvg}}
    background-repeat: no-repeat;
    background-size: {{width}}{{units}} {{height}}{{units}};
    content: ' ';
    display: $display;

    @if map-has-key($svgs, $name) {
        $svg: map-get($svgs, $name);

        background-position: map-get($svg, background-position);
        height: map-get($svg, height);
        width: map-get($svg, width);
    }
}

@mixin svg--position($name) {
    @if map-has-key($svgs, $name) {
        $svg: map-get($svgs, $name);

        background-position: map-get($svg, background-position);
    }
}

$svgs: (
    {{#sprites}}
    {{fileName}}: (
        background-position: {{x}}{{units}} {{y}}{{units}},
        height: {{h}}{{units}},
        width: {{w}}{{units}}
    ),
    {{/sprites}}
);