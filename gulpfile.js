const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const ghPages = require('gulp-gh-pages');

const bundler = browserify({ entries: './index.js' });

gulp.task('clean', () =>
	del('./dist', { force: true })
);

gulp.task('js', () =>
	bundler.bundle()
		.pipe(source('script.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
);

gulp.task('css', () =>
	gulp.src('./style/**/*.less')
		.pipe(less())
		.pipe(cleanCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('./dist'))
);

gulp.task('watch', () => {
	bundler.plugin(watchify);
	gulp.series('js')();
	bundler.on('update', gulp.series('js'));
	gulp.watch(['./style/**/*.less'], gulp.series('css'));
});

gulp.task('copyStatic', () =>
	gulp.src('./static/**').pipe(gulp.dest('./dist'))
);

gulp.task('default',
	gulp.series('clean',
		gulp.parallel('copyStatic', 'js', 'css')
	)
);

gulp.task('gh-pages', () => 
	gulp.src('./dist/**/*').pipe(ghPages())
);

gulp.task('deploy', gulp.series('default', 'gh-pages'));

gulp.task('dev', gulp.series('css', 'watch'));
